import HeaderClient, {type NavItem} from '@/app/components/site/HeaderClient'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'

const NAV: NavItem[] = [
  {label: 'Shop all', href: '/shop'},
  {label: 'Bouquets', href: '/category/bouquets'},
  {label: 'Plants', href: '/category/plants'},
  {label: 'Occasions', href: '/occasions'},
  {label: 'Journal', href: '/journal'},
  {label: 'About', href: '/about'},
  {label: 'Contact', href: '/contact'},
]

export default async function Header() {
  const {data: settings} = await sanityFetch({query: settingsQuery, stega: false})

  return (
    <HeaderClient
      title={settings?.title || 'Petal & Verse'}
      announcement={settings?.announcement || []}
      nav={NAV}
    />
  )
}
