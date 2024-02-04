import clsx from 'clsx'

interface LogoProps {
	src: string
	alt: string
	className?: string
}

const Logo = ({ src, alt, className }: LogoProps) => {
	if (!src) return null

	return (
		<img
			src={src}
			alt={alt}
			className={clsx('w-full h-full', className)}
		/>
	)
}
export default Logo
