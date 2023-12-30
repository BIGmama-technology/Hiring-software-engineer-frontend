import { Editor } from "@tiptap/react";
import { ToolbarInlineAdvanced } from "./TextInlineAdvanced";
import { ToolbarAlignment } from "./ToolbarAlignment";
import { ToolbarBlock } from "./ToolbarBlock";
import { ToolbarCommands } from "./ToolbarCommands";
import { ToolbarHeadings } from "./ToolbarHeadings";
import { ToolbarInline } from "./ToolbarInline";
import { ToolbarMedia } from "./ToolbarMedia";
import styles from "./Toolbar.module.css";
import NavMenu from "@/components/NavMenu";
import ShareButton from "@/components/ShareButton";

type Props = {
  editor: Editor;
};

export function Toolbar({ editor }: Props) {
    document.documentElement.setAttribute("data-theme", "dark");
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarSection}>
        <ToolbarCommands editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarHeadings editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarInline editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarInlineAdvanced editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarAlignment editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarBlock editor={editor} />
      </div>
      <div className={styles.toolbarSection}>
        <ToolbarMedia editor={editor} />
      </div>
      <div>
        <NavMenu />
      </div>
      <div>
        <ShareButton />
      </div>
    </div>
  );
}
