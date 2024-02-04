import ButtonLink from '@/components/Link'

type Props = {}
const Navigation = (props: Props) => {
  return (
    <div className="w-full border-b border-b-black">
      <div className="mx-auto flex flex-row items-center justify-center">
        {[
          'Home',
          'EU Finance',
          'Capital Market',
          'World Economy',
          'Opinion',
          'Finance',
          'Companies',
          'Environment',
          'Sport Economy',
          'Blog',
          'Podcats',
          'Video',
        ].map((value, index) => (
          <ButtonLink
            key={`menu-${index}-${value}`}
            className="rounded-none px-2 py-6 text-sm font-semibold capitalize text-black hover:border-b-4 hover:border-b-primary hover:no-underline"
          >
            {value}
          </ButtonLink>
        ))}
      </div>
    </div>
  )
}
export default Navigation
