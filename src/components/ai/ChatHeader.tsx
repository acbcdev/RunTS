import { Button } from "@/components/ui/button";
import { MessageCircle, Plus } from "lucide-react";
import { motion } from "motion/react";

interface ChatHeaderProps {
	onNewChat: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
	return (
		<header className="flex items-center justify-between gap-2 px-4 py-2">
			<motion.div
				className="flex gap-x-2 items-center"
				initial={{ opacity: 0, x: -10 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3, delay: 0.1 }}
			>
				<motion.div
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
				>
					<MessageCircle />
				</motion.div>
				<p>Chat</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			>
				<Button
					variant="ghost"
					size="icon"
					onClick={onNewChat}
					className="flex items-center gap-2 relative overflow-hidden"
					asChild
				>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<motion.div
							whileHover={{ rotate: 90 }}
							transition={{ duration: 0.2 }}
						>
							<Plus />
						</motion.div>
					</motion.button>
				</Button>
			</motion.div>
		</header>
	);
}
