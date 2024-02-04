import Logo from '@/components/Logo'
import logoSrc from '@/assets/logo.svg'
import { BsGlobe, BsSearch } from 'react-icons/bs'
import Box from '@/components/Box'
import { Button } from '@/components/ui/button'
import ButtonLink from '@/components/Link'
import Navigation from '@/components/Header/Navigation'

interface Props {}
const Header = (props: Props) => {
  return (
    <Box className="mx-auto flex flex-col items-stretch gap-y-4">
      <div className="flex flex-row items-start justify-between gap-y-3">
        <div className="flex flex-row items-center justify-start gap-x-3">
          <BsGlobe size={16} className="text-primary" />
          <span className="font-base text-sm font-light">
            Thursday, February 25, 2020
          </span>
        </div>

        <Logo
          src={logoSrc}
          alt="Moneta Logo"
          className="mt-2 flex max-h-11 max-w-[10rem]"
        />

        <div className="flex flex-row items-start justify-between gap-x-6">
          <ButtonLink>
            <BsSearch size={16} />
          </ButtonLink>
          <ButtonLink>Sign In</ButtonLink>
          <Button className="rounded-full px-7 py-2">Subscribe</Button>
        </div>
      </div>

      <Navigation />
    </Box>
  )
}
export default Header
