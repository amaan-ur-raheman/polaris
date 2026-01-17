import {
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
    WidgetType,
    keymap,
} from "@codemirror/view";
import { StateEffect, StateField } from "@codemirror/state";

// StateEffect: A way to send "messages" to update state
// We define on effect type for setting the suggestion text
const setSuggestionEffect = StateEffect.define<string | null>();

// StateField: Holds our suggestion state in our editor
// - create(): Returns the initial value when the editor loads
// - update(): Called on every transaction (keystrokes, etc) to potentially update the value
const suggestionState = StateField.define<string | null>({
    create() {
        return "// TODO: implement this";
    },
    update(value, transaction) {
        // Check each effect in this transaction
        // If we find our setSuggestionEffect, return its new value
        // Otherwise, return the current value unchanged
        for (const effect of transaction.effects) {
            if (effect.is(setSuggestionEffect)) {
                return effect.value;
            }
        }
        return value;
    },
});

// WidgetType: Creates c custom DOM elements to display in the editor.
// toDOM() is called by CodeMirror to create the actual HTML element.
class SuggestionWidget extends WidgetType {
    constructor(readonly text: string) {
        super();
    }

    toDOM() {
        const span = document.createElement("span");
        span.textContent = this.text;
        span.style.opacity = "0.4"; // Ghost text appearance
        span.style.pointerEvents = "none"; // Don't interfere with clicks
        return span;
    }
}

const renderPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
            this.decorations = this.build(view);
        }

        update(update: ViewUpdate) {
            // Rebuild decorations if doc changed, cursor moved or suggestion changed
            const suggestionChanged = update.transactions.some(
                (transaction) => {
                    return transaction.effects.some((effect) => {
                        return effect.is(setSuggestionEffect);
                    });
                },
            );

            // Rebuild decorations if doc changed, cursor moved or suggestion changed
            const shouldRebuild =
                update.docChanged || update.selectionSet || suggestionChanged;

            if (shouldRebuild) {
                this.decorations = this.build(update.view);
            }
        }

        build(view: EditorView) {
            // Get the current suggestion from the state
            const suggestion = view.state.field(suggestionState);
            if (!suggestion) {
                return Decoration.none;
            }

            // Create a widget decoration at the cursor position
            const cursor = view.state.selection.main.head;
            return Decoration.set([
                Decoration.widget({
                    widget: new SuggestionWidget(suggestion),
                    side: 1, // Render after the cursor(side: 1) not before(side: -1)
                }).range(cursor),
            ]);
        }
    },
    { decorations: (plugin) => plugin.decorations }, // Tell CodeMirror to use our decorations
);

const acceptSuggestionKeymap = keymap.of([
    {
        key: "Tab",
        run: (view) => {
            const suggestion = view.state.field(suggestionState);
            if (!suggestion) {
                return false; // No suggestion? Let tab to do its normal job (indent)
            }

            const cursor = view.state.selection.main.head;
            view.dispatch({
                changes: { from: cursor, insert: suggestion }, // Insert the suggestion text
                selection: { anchor: cursor + suggestion.length }, // Move cursor to end
                effects: setSuggestionEffect.of(null), // Clear the suggestion
            });
            return true; // We handled Tab, don't indent
        },
    },
]);

export const suggestion = (fileName: string) => [
    suggestionState, // Our state storage
    renderPlugin, // Renders the ghost text
    acceptSuggestionKeymap, // Tab tp accept
];
