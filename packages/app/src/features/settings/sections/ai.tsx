import { Providers } from "@/features/ai/providers/Providers";
import { TabsContent } from "@/features/ui/tabs";
import { SettingsSection } from "../components/SettingsSection";

export function AI() {
	return (
		<TabsContent value="ai" className="m-0 flex flex-col gap-7">
			<SettingsSection title="Providers">
				<Providers />
			</SettingsSection>
		</TabsContent>
	);
}
