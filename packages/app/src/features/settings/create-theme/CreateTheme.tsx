import { Input } from "@/features/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/features/ui/popover";
import { Label } from "../ui/label";

export default function CreateTheme() {
	return (
		<Popover>
			<PopoverTrigger>
				<button
					type="button"
					className="border-accent/5 w-full h-full duration-200 cursor-pointer rounded-lg p-3 border bg-primary/5 hover:bg-primary/10"
				>
					Create a new theme
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<CreateThemeForm />
			</PopoverContent>
		</Popover>
	);
}

function CreateThemeForm() {
	return (
		<>
			<section>
				<Label>
					Name
					<Input autoFocus />
				</Label>
			</section>
			<section className="grid grid-cols-2 gap-4  ">
				<div>
					<Label htmlFor="background">Background</Label>
					<Input className="my-2" id="background" />
				</div>
				<div>
					<Label htmlFor="foreground">Foreground</Label>
					<Input className="my-2" id="foreground" />
				</div>
				<div>
					<Label htmlFor="border">Border</Label>
					<Input className="my-2" id="border" />
				</div>
				<div>
					<Label htmlFor="accent">Accent</Label>
					<Input className="my-2" id="accent" />
				</div>
				<div>
					<Label htmlFor="selection">Selection</Label>
					<Input className="my-2" id="selection" />
				</div>
				<div>
					<Label htmlFor="header">Header</Label>
					<Input className="my-2" id="header" />
				</div>
				<div>
					<Label htmlFor="hover">Hover</Label>
					<Input className="my-2" id="hover" />
				</div>
				<div>
					<Label htmlFor="muted">Muted</Label>
					<Input className="my-2" id="muted" />
				</div>
				<div>
					<Label htmlFor="success">Success</Label>
					<Input className="my-2" id="success" />
				</div>
				<div>
					<Label htmlFor="warning">Warning</Label>
					<Input className="my-2" id="warning" />
				</div>
				<div>
					<Label htmlFor="error">Error</Label>
					<Input className="my-2" id="error" />
				</div>
				<div>
					<Label htmlFor="info">Info</Label>
					<Input className="my-2" id="info" />
				</div>
			</section>
		</>
	);
}
