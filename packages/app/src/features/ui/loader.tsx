type LoaderProps = {
	className?: string;
};

export function Loader({ className }: LoaderProps) {
	return (
		<div className={className}>
			<div className="spinner">
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
				<div className="spinner-blade"></div>
			</div>
		</div>
	);
}
