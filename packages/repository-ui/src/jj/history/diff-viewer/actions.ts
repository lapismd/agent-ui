import CopyIcon from "@lucide/svelte/icons/copy";
import FolderOpenIcon from "@lucide/svelte/icons/folder-open";
import FileIcon from "@lucide/svelte/icons/file";
import type {
  RepositoryDiffActionContext,
  RepositoryDiffMenuItem,
} from "./types.js";

/** Native paths, clipboard and reveal authority are explicitly supplied by hosts. */
export function createRepositoryDiffMenu(options: {
  copyText?(text: string): Promise<void>;
  absolutePath?(context: RepositoryDiffActionContext): string | Promise<string>;
  reveal?(context: RepositoryDiffActionContext): void | Promise<void>;
  revealLabel?: string;
}): RepositoryDiffMenuItem[] {
  const copy = options.copyText;
  const children: RepositoryDiffMenuItem[] = [];
  if (copy && options.absolutePath)
    children.push({
      id: "copy-absolute",
      label: "Copy path",
      icon: CopyIcon,
      onSelect: async (context) => copy(await options.absolutePath!(context)),
    });
  if (copy)
    children.push({
      id: "copy-relative",
      label: "Copy relative path",
      icon: FileIcon,
      onSelect: (context) => copy(context.path),
    });
  return [
    ...(children.length
      ? [{ id: "copy-path", label: "Copy path", icon: CopyIcon, children }]
      : []),
    ...(options.reveal
      ? [
          {
            id: "reveal",
            label: options.revealLabel ?? "Show in Finder",
            icon: FolderOpenIcon,
            onSelect: options.reveal,
          },
        ]
      : []),
  ];
}
