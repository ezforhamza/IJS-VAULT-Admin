import { useEffect, useRef } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { cn } from "@/utils";

interface HtmlEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export default function HtmlEditor({ value, onChange }: HtmlEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const isUpdatingRef = useRef(false);

	useEffect(() => {
		if (editorRef.current && !isUpdatingRef.current) {
			editorRef.current.innerHTML = value;
		}
	}, [value]);

	const handleInput = () => {
		if (editorRef.current) {
			isUpdatingRef.current = true;
			onChange(editorRef.current.innerHTML);
			setTimeout(() => {
				isUpdatingRef.current = false;
			}, 0);
		}
	};

	const execCommand = (command: string, value?: string) => {
		document.execCommand(command, false, value);
		editorRef.current?.focus();
		handleInput();
	};

	const createLink = () => {
		const url = prompt("Enter URL:");
		if (url) {
			execCommand("createLink", url);
		}
	};

	return (
		<div className="space-y-2">
			<Label>Content</Label>

			{/* Toolbar */}
			<div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/30">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => execCommand("bold")}
					title="Bold (Ctrl+B)"
					className="h-8 w-8 p-0"
				>
					<Icon icon="solar:text-bold-outline" size={18} />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => execCommand("italic")}
					title="Italic (Ctrl+I)"
					className="h-8 w-8 p-0"
				>
					<Icon icon="solar:text-italic-outline" size={18} />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => execCommand("underline")}
					title="Underline (Ctrl+U)"
					className="h-8 w-8 p-0"
				>
					<Icon icon="solar:text-underline-outline" size={18} />
				</Button>

				<div className="w-px h-8 bg-border mx-1" />

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => execCommand("formatBlock", "<h2>")}
					title="Heading 2"
					className="h-8 px-2 text-xs font-semibold"
				>
					H2
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => execCommand("formatBlock", "<h3>")}
					title="Heading 3"
					className="h-8 px-2 text-xs font-semibold"
				>
					H3
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => execCommand("formatBlock", "<p>")}
					title="Paragraph"
					className="h-8 px-2 text-xs"
				>
					P
				</Button>

				<div className="w-px h-8 bg-border mx-1" />

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => execCommand("insertUnorderedList")}
					title="Bullet List"
					className="h-8 w-8 p-0"
				>
					<Icon icon="solar:list-outline" size={18} />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => execCommand("insertOrderedList")}
					title="Numbered List"
					className="h-8 w-8 p-0"
				>
					<Icon icon="solar:list-down-minimalistic-outline" size={18} />
				</Button>

				<div className="w-px h-8 bg-border mx-1" />

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={createLink}
					title="Insert Link"
					className="h-8 w-8 p-0"
				>
					<Icon icon="solar:link-outline" size={18} />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => execCommand("unlink")}
					title="Remove Link"
					className="h-8 w-8 p-0"
				>
					<Icon icon="solar:link-broken-outline" size={18} />
				</Button>
			</div>

			{/* Editor */}
			<div
				ref={editorRef}
				contentEditable
				onInput={handleInput}
				className={cn(
					"min-h-[500px] w-full rounded-md border bg-background px-4 py-3",
					"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
					"prose prose-sm max-w-none",
					"[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-6",
					"[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-5",
					"[&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-3",
					"[&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:ml-4 [&_ul]:mb-3",
					"[&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_ol]:ml-4 [&_ol]:mb-3",
					"[&_a]:text-primary [&_a]:hover:underline",
					"[&_strong]:font-semibold",
					"[&_em]:italic",
				)}
			/>
		</div>
	);
}
