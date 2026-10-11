type IconProps = React.SVGProps<SVGSVGElement> & {size?: number}

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const BagIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
)
export const CloseIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const PlusIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const MinusIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14" />
  </svg>
)
export const ArrowIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const MenuIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 8h16M4 16h10" />
  </svg>
)
export const TruckIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.5" />
    <circle cx="17" cy="17.5" r="1.5" />
  </svg>
)
export const LeafIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
    <path d="M5 19 13 11" />
  </svg>
)
export const HeartIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
)
export const InstagramIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
)
export const PinterestIcon = ({size, ...p}: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10.5 20 12.5 11m-1.3 3.7c3.8 1.2 6-1.1 6-4.1C17.2 7.9 15 6 12 6s-5 2.1-5 4.5c0 1.2.4 2 1.2 2.4" />
  </svg>
)
