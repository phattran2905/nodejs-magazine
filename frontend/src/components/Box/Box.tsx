import clsx from 'clsx'

type Props = {
	className: string
	children: React.ReactNode
}

const Box = ({ className, children }: Props) => {
	return (
		<div
			className={clsx(
				'px-[2.5rem] max-w-[85rem] relative w-full my-5',
				className
			)}
		>
			{children}
		</div>
	)
}

export default Box
