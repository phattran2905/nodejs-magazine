import clsx from 'clsx'
import { Button } from '@/components/ui/button'

type Props = {
	className?: string
	children: React.ReactNode
}
const ButtonLink = ({ className, children }: Props) => {
	return (
		<Button
			variant="link"
			className={clsx('p-0', className)}
		>
			{children}
		</Button>
	)
}
export default ButtonLink
