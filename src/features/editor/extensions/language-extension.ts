import { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { rust } from "@codemirror/lang-rust";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { sass } from "@codemirror/lang-sass";
import { vue } from "@codemirror/lang-vue";
import { go } from "@codemirror/lang-go";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";

export const getLanguageExtension = (filename: string): Extension => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
        case "js":
            return javascript();
        case "jsx":
            return javascript({ jsx: true });
        case "ts":
            return javascript({ typescript: true });
        case "tsx":
            return javascript({ jsx: true, typescript: true });
        case "html":
            return html();
        case "css":
            return css();
        case "json":
            return json();
        case "md":
        case "mdx":
            return markdown();
        case "rs":
            return rust();
        case "py":
            return python();
        case "java":
            return java();
        case "c":
        case "cpp":
        case "h":
        case "hpp":
            return cpp();
        case "sass":
        case "scss":
            return sass();
        case "vue":
            return vue();
        case "go":
            return go();
        case "php":
            return php();
        case "sql":
            return sql();
        case "xml":
            return xml();
        case "yaml":
        case "yml":
            return yaml();
        default:
            return [];
    }
};