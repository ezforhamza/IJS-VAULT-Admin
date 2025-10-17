import { cn } from "@/utils";
import { NavLink } from "react-router";
import logoSvg from "@/assets/icons/logo.svg";

interface Props {
	size?: number | string;
	className?: string;
}
function Logo({ size = 50, className }: Props) {
	return (
		<NavLink to="/" className={cn(className)}>
			<img src={logoSvg} alt="IJS VAULT" style={{ width: size, height: size }} />
		</NavLink>
	);
}

export default Logo;
