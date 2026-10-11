/**
 * Seeds the dataset with a complete flower shop: images, categories, occasions, products,
 * authors, journal posts, testimonials, pages and site settings.
 *
 * Run from /studio:  npx sanity exec scripts/seed.ts --with-user-token
 * Safe to re-run: documents use fixed IDs (createOrReplace) and Sanity de-duplicates image assets.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-09-25'})

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const key = () => Math.random().toString(36).slice(2, 14)

const ref = (_ref: string, withKey = false) => ({
  _type: 'reference' as const,
  _ref,
  ...(withKey ? {_key: key()} : {}),
})

/** Parses **bold** and _italic_ into Portable Text spans. */
function spans(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).filter(Boolean)
  return parts.map((part) => {
    if (part.startsWith('**')) return {_type: 'span', _key: key(), text: part.slice(2, -2), marks: ['strong']}
    if (part.startsWith('_')) return {_type: 'span', _key: key(), text: part.slice(1, -1), marks: ['em']}
    return {_type: 'span', _key: key(), text: part, marks: []}
  })
}

const block = (text: string, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: spans(text),
})
const p = (text: string) => block(text)
const h2 = (text: string) => block(text, 'h2')
const h3 = (text: string) => block(text, 'h3')
const quote = (text: string) => block(text, 'blockquote')
const bullet = (text: string) => ({...block(text), listItem: 'bullet', level: 1})
const numbered = (text: string) => ({...block(text), listItem: 'number', level: 1})

/* -------------------------------------------------------------------------- */
/*                                   Images                                   */
/* -------------------------------------------------------------------------- */

// Curated Unsplash photos (free to use under the Unsplash License)
const IMAGES = {
  heroMoody: '1457089328109-e5d9bd499191',
  shopFront: '1487070183336-b863922373d4',
  blushBouquet: '1563241527-3004b7be0ffd',
  kraftBouquet: '1567696153798-9111f9cd3d0d',
  gardenRoses: '1591886960571-74d43a9d4166',
  pinkWhiteRoses: '1596438459194-f275f413d6ff',
  tulipVase: '1561181286-d3fee7d55364',
  pinkTulip: '1520763185298-1b434c919102',
  tulipField: '1468327768560-75b778cbb551',
  redRoses: '1494972308805-463bc619d34e',
  redRose: '1496062031456-07b8f162a322',
  whiteRose: '1495231916356-a86217efff12',
  lily: '1502977249166-824b3a8a4d6d',
  daisy: '1508784411316-02b8cd4d3a3a',
  cosmos: '1530092285049-1c42085fd395',
  bouquetVase: '1533616688419-b7a585564566',
  singleStem: '1525310072745-f49212b5ac6d',
  heartHands: '1526047932273-341f2a7631f9',
  sunflowers: '1455659817273-f96807779a8a',
  sunflower: '1470509037663-253afd7f0f51',
  sunflowerField: '1597848212624-a19eb35e2651',
  lavender: '1499002238440-d264edd596ec',
  poppies: '1444930694458-01babf71870c',
  yellowPoppies: '1490750967868-88aa4486c946',
  blossom: '1462275646964-a0e3386b89fa',
  redFlowers: '1519378058457-4c29a0a2efac',
  succulents: '1446071103084-c257b5f70672',
  fiddleLeaf: '1453904300235-0f2f60b15b5d',
  cactus: '1459411552884-841db9b3cc2a',
  aloe: '1485955900006-10f4d324d411',
  cactusFlower: '1509937528035-ad76254b0356',
  interiorPlant: '1558603668-6570496b66f8',
  trowel: '1416879595882-3373a0480b5b',
  amelia: '1438761681033-6461ffad8d80',
  sofia: '1494790108377-be9c29b29330',
  marco: '1507003211169-0a1dd7228f2d',
  elena: '1544005313-94ddf0286df2',
} as const

type ImageName = keyof typeof IMAGES
const assetIds = {} as Record<ImageName, string>

async function uploadImages() {
  const entries = Object.entries(IMAGES) as [ImageName, string][]
  const concurrency = 5
  let index = 0
  async function worker() {
    while (index < entries.length) {
      const [name, id] = entries[index++]
      const url = `https://images.unsplash.com/photo-${id}?w=2000&q=80&fm=jpg`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to download ${name} (${res.status})`)
      const buffer = Buffer.from(await res.arrayBuffer())
      const asset = await client.assets.upload('image', buffer, {
        filename: `${name}.jpg`,
        source: {name: 'unsplash', id, url: `https://unsplash.com/photos/${id}`},
      })
      assetIds[name] = asset._id
      console.log(`  ✓ ${name}`)
    }
  }
  await Promise.all(Array.from({length: concurrency}, worker))
}

const img = (name: ImageName, alt: string, withKey = false, type = 'altImage') => ({
  _type: type,
  ...(withKey ? {_key: key()} : {}),
  asset: ref(assetIds[name]),
  alt,
})

const button = (buttonText: string, href: string) => ({
  _type: 'button',
  buttonText,
  link: {_type: 'link', linkType: 'href', href},
})

/* -------------------------------------------------------------------------- */
/*                                  Taxonomy                                  */
/* -------------------------------------------------------------------------- */

function buildCategories() {
  const categories: [string, string, string, ImageName, string][] = [
    ['bouquets', 'Bouquets', 'Hand-tied, loose and garden-gathered — wrapped in paper and ready for a vase.', 'blushBouquet', 'Hand-tied blush bouquet wrapped in paper'],
    ['arrangements', 'Arrangements', 'Vase-ready designs that arrive arranged, watered and ready to sit on a table.', 'bouquetVase', 'Mixed arrangement in a clear glass vase'],
    ['dried', 'Dried & Everlasting', 'Pressed, dried and preserved stems that last for months, not days.', 'kraftBouquet', 'Dried bouquet wrapped in kraft paper'],
    ['plants', 'House Plants', 'Easy-going greenery, potted in our own ceramics and delivered with care cards.', 'fiddleLeaf', 'Fiddle leaf fig against a white wall'],
    ['gifts', 'Gifts & Subscriptions', 'Single stems, love notes and monthly flower subscriptions.', 'heartHands', 'Hands holding a heart made of flowers'],
  ]
  return categories.map(([slug, title, description, image, alt], i) => ({
    _id: `category-${slug}`,
    _type: 'category',
    title,
    slug: {_type: 'slug', current: slug},
    description,
    image: img(image, alt),
    orderRank: i + 1,
  }))
}

function buildOccasions() {
  const occasions: [string, string, string, ImageName, string][] = [
    ['birthday', 'Birthday', 'Bright, joyful stems for another trip around the sun.', 'sunflowers', 'A field of sunflowers'],
    ['love', 'Love & Romance', 'Deep reds and soft blush for anniversaries and first dates.', 'redRoses', 'A bed of red roses'],
    ['wedding', 'Wedding', 'Quiet whites and garden roses for the biggest day.', 'whiteRose', 'Single white rose'],
    ['sympathy', 'Sympathy', 'Gentle, calm arrangements that say what words cannot.', 'lily', 'White and pink stargazer lily'],
    ['just-because', 'Just Because', 'No reason needed. Our favourite occasion of all.', 'cosmos', 'White cosmos against blue sky'],
  ]
  return occasions.map(([slug, title, description, image, alt]) => ({
    _id: `occasion-${slug}`,
    _type: 'occasion',
    title,
    slug: {_type: 'slug', current: slug},
    description,
    image: img(image, alt),
  }))
}

/* -------------------------------------------------------------------------- */
/*                                  Products                                  */
/* -------------------------------------------------------------------------- */

type ProductSeed = {
  slug: string
  name: string
  tagline: string
  price: number
  compareAtPrice?: number
  variants?: [string, string, number][]
  description: string[]
  care: string[]
  images: [ImageName, string][]
  category: string
  occasions: string[]
  colors: string[]
  featured?: boolean
  inStock?: boolean
}

const DEFAULT_CARE = [
  'Trim 2cm from each stem at an angle before placing in water.',
  'Use a clean vase and change the water every two days.',
  'Keep away from direct sun, radiators and ripening fruit.',
]

const PRODUCTS: ProductSeed[] = [
  {
    slug: 'the-blush-hour',
    name: 'The Blush Hour',
    tagline: 'Garden roses, lisianthus and a whisper of eucalyptus.',
    price: 58,
    variants: [
      ['Petite', '12 stems', 58],
      ['Classic', '20 stems', 78],
      ['Grand', '32 stems', 108],
    ],
    description: [
      'Our signature bouquet, inspired by the soft light just before sunset. Blush garden roses sit beside ruffled lisianthus, spray roses and silver-dollar eucalyptus, all loosely hand-tied so it looks freshly gathered.',
      'Every Blush Hour is wrapped in our recycled cotton paper and finished with a hand-written card.',
    ],
    care: DEFAULT_CARE,
    images: [
      ['blushBouquet', 'Blush bouquet of garden roses wrapped in paper'],
      ['pinkWhiteRoses', 'Close-up of pink and white roses'],
    ],
    category: 'bouquets',
    occasions: ['love', 'birthday', 'wedding'],
    colors: ['blush', 'white'],
    featured: true,
  },
  {
    slug: 'velvet-midnight',
    name: 'Velvet Midnight',
    tagline: 'Moody ranunculus, protea and deep crimson roses.',
    price: 64,
    variants: [
      ['Petite', '12 stems', 64],
      ['Classic', '20 stems', 86],
      ['Grand', '30 stems', 118],
    ],
    description: [
      'A dramatic, painterly bouquet for people who prefer their flowers a little dark. Crimson roses, coral ranunculus and a statement protea are framed by deep foliage.',
      'Pairs wonderfully with candlelight and a good bottle of red.',
    ],
    care: DEFAULT_CARE,
    images: [
      ['heroMoody', 'Dark moody bouquet with red ranunculus and protea'],
      ['redFlowers', 'Field of red flowers'],
    ],
    category: 'bouquets',
    occasions: ['love', 'birthday'],
    colors: ['red', 'orange', 'purple'],
    featured: true,
  },
  {
    slug: 'sun-salutation',
    name: 'Sun Salutation',
    tagline: 'Sunflowers, golden solidago and a lot of good mood.',
    price: 48,
    variants: [
      ['Petite', '6 stems', 48],
      ['Classic', '12 stems', 66],
      ['Grand', '20 stems', 92],
    ],
    description: [
      'Nothing says "happy birthday" quite like a fistful of sunflowers. We pair them with golden solidago and soft green bupleurum for a bouquet that looks like late summer.',
    ],
    care: [
      'Sunflowers are thirsty — top up the water daily.',
      'Remove lower leaves so none sit below the waterline.',
      'Support heavy heads with a tall vase.',
    ],
    images: [
      ['sunflowers', 'A mass of sunflowers'],
      ['sunflower', 'Single sunflower in a field'],
      ['sunflowerField', 'Sunflower against a blue sky'],
    ],
    category: 'bouquets',
    occasions: ['birthday', 'just-because'],
    colors: ['yellow'],
    featured: true,
  },
  {
    slug: 'garden-party-roses',
    name: 'Garden Party Roses',
    tagline: 'Fully-open David Austin roses in a stoneware vase.',
    price: 72,
    variants: [
      ['Classic', '15 roses', 72],
      ['Luxe', '25 roses', 96],
      ['Opulent', '40 roses', 132],
    ],
    description: [
      'Generous, cupped garden roses in apricot, blush and cream, arranged in one of our matte stoneware vases that you get to keep.',
      'Each rose is selected the morning of delivery from our growers in the valley.',
    ],
    care: DEFAULT_CARE,
    images: [
      ['gardenRoses', 'Pink and peach garden roses in a glass vase'],
      ['pinkWhiteRoses', 'Pink and white roses with lisianthus'],
    ],
    category: 'arrangements',
    occasions: ['wedding', 'love', 'birthday'],
    colors: ['blush', 'orange'],
    featured: true,
  },
  {
    slug: 'tulip-sonnet',
    name: 'Tulip Sonnet',
    tagline: 'Twenty French tulips that keep growing in the vase.',
    price: 42,
    variants: [
      ['10 stems', 'Single colour', 42],
      ['20 stems', 'Mixed pinks', 58],
      ['30 stems', 'Mixed pinks', 79],
    ],
    description: [
      'Tulips are the only flower that keeps growing after it is cut — they bend, twist and stretch toward the light, so your bouquet changes every day.',
      'We use long-stemmed French tulips in shades of pink and cream.',
    ],
    care: [
      'Use cold water and a tall vase.',
      'Tulips grow toward light — rotate the vase daily for straight stems.',
      'Do not mix with daffodils, which shorten their life.',
    ],
    images: [
      ['tulipVase', 'Pink tulips in a glass jar'],
      ['pinkTulip', 'Single pink tulip on a pink background'],
      ['tulipField', 'Red and white tulips in a field'],
    ],
    category: 'bouquets',
    occasions: ['just-because', 'birthday'],
    colors: ['blush', 'white'],
    featured: true,
  },
  {
    slug: 'the-single-stem',
    name: 'The Single Stem',
    tagline: 'One perfect red rose in a hand-blown bud vase.',
    price: 24,
    description: [
      'Sometimes one is enough. A single long-stemmed Ecuadorian rose, delivered in a hand-blown recycled glass bud vase with a tied love note.',
    ],
    care: DEFAULT_CARE,
    images: [
      ['redRose', 'Single red rose with dew drops'],
      ['redRoses', 'Bed of red roses'],
    ],
    category: 'gifts',
    occasions: ['love'],
    colors: ['red'],
  },
  {
    slug: 'white-lily-hymn',
    name: 'White Lily Hymn',
    tagline: 'Calm whites and soft greens for quiet moments.',
    price: 68,
    variants: [
      ['Classic', 'Hand-tied', 68],
      ['Arranged', 'In a ceramic urn', 94],
    ],
    description: [
      'A gentle arrangement of oriental lilies, white roses and soft eucalyptus. Designed to bring comfort, it is the arrangement we are most often asked to send for sympathy.',
      'Lilies arrive in bud and open over several days. We remove the pollen for you.',
    ],
    care: [
      'Remove any new pollen anthers as the lilies open — pollen stains.',
      'Lilies are toxic to cats. Keep out of reach of pets.',
      ...DEFAULT_CARE.slice(1),
    ],
    images: [
      ['lily', 'Pink and white stargazer lily'],
      ['whiteRose', 'Single white rose'],
    ],
    category: 'arrangements',
    occasions: ['sympathy', 'wedding'],
    colors: ['white', 'green'],
    featured: true,
  },
  {
    slug: 'meadow-cosmos',
    name: 'Meadow Cosmos',
    tagline: 'Airy cosmos, chamomile and wild grasses.',
    price: 44,
    variants: [
      ['Posy', 'Small', 44],
      ['Armful', 'Large', 62],
    ],
    description: [
      'Like a walk through an unmown meadow. Cosmos, chamomile daisies and feathery grasses are gathered loosely so every stem has room to dance.',
    ],
    care: DEFAULT_CARE,
    images: [
      ['cosmos', 'White cosmos flowers against the sky'],
      ['daisy', 'Single white daisy on black'],
    ],
    category: 'bouquets',
    occasions: ['just-because'],
    colors: ['white', 'green'],
  },
  {
    slug: 'wild-poppy-posy',
    name: 'Wild Poppy Posy',
    tagline: 'Papery Icelandic poppies in sunset tones.',
    price: 38,
    compareAtPrice: 46,
    variants: [
      ['Posy', '10 stems', 38],
      ['Bunch', '20 stems', 52],
    ],
    description: [
      'Icelandic poppies arrive as fuzzy buds and burst open into crinkled, silk-like petals in coral, tangerine and butter yellow. Short season — get them while you can.',
    ],
    care: [
      'Poppies are delivered in bud and open within 1–2 days.',
      'Re-cut stems and place straight into cool water.',
      'Enjoy them quickly — a poppy is a fleeting thing.',
    ],
    images: [
      ['poppies', 'Red poppies in a sunlit field'],
      ['yellowPoppies', 'Yellow poppies under a blue sky'],
    ],
    category: 'bouquets',
    occasions: ['birthday', 'just-because'],
    colors: ['orange', 'red', 'yellow'],
  },
  {
    slug: 'lavender-fields-bundle',
    name: 'Lavender Fields Bundle',
    tagline: 'Dried French lavender, tied with linen ribbon.',
    price: 36,
    variants: [
      ['Bundle', '100 stems', 36],
      ['Double', '200 stems', 54],
    ],
    description: [
      'Grown in Provence and air-dried in small batches, this lavender keeps its scent for months. Hang it in a wardrobe, lay it on a pillow or simply stand it in a jug.',
    ],
    care: [
      'Keep away from humidity and direct sunlight to preserve colour.',
      'Squeeze gently to release fresh scent.',
      'No water needed — ever.',
    ],
    images: [
      ['lavender', 'Lavender field at sunset'],
      ['kraftBouquet', 'Dried bouquet wrapped in kraft paper'],
    ],
    category: 'dried',
    occasions: ['just-because'],
    colors: ['purple'],
  },
  {
    slug: 'everlasting-kraft-bouquet',
    name: 'Everlasting Kraft Bouquet',
    tagline: 'Bunny tails, strawflower and bleached ruscus.',
    price: 52,
    compareAtPrice: 60,
    variants: [
      ['Classic', 'Medium', 52],
      ['Statement', 'Large', 74],
    ],
    description: [
      'A dried bouquet that lasts a year or more. Textural bunny-tail grass, strawflowers, dried sunflowers and bleached ruscus, wrapped in recycled kraft paper.',
    ],
    care: [
      'Display out of direct sunlight to slow fading.',
      'Dust gently with a hairdryer on its coolest setting.',
      'No water needed.',
    ],
    images: [
      ['kraftBouquet', 'Dried bouquet in kraft paper held in hand'],
      ['singleStem', 'Single dried stem on grey background'],
    ],
    category: 'dried',
    occasions: ['birthday', 'just-because'],
    colors: ['blush', 'yellow', 'orange'],
    featured: true,
  },
  {
    slug: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    tagline: 'The sculptural statement plant, potted in stoneware.',
    price: 65,
    variants: [
      ['Medium', '60–80cm', 65],
      ['Large', '120–140cm', 95],
    ],
    description: [
      'Big, glossy, violin-shaped leaves. Our fiddle leaf figs are grown in a greenhouse two hours from the studio and acclimatised for a fortnight before they reach you.',
    ],
    care: [
      'Bright, indirect light. Turn a quarter turn every month.',
      'Water when the top 5cm of soil is dry.',
      'Wipe leaves with a damp cloth to keep them glossy.',
    ],
    images: [
      ['fiddleLeaf', 'Fiddle leaf fig on a white background'],
      ['interiorPlant', 'Bright living room with plants'],
    ],
    category: 'plants',
    occasions: ['just-because'],
    colors: ['green'],
  },
  {
    slug: 'desert-trio',
    name: 'Desert Trio',
    tagline: 'Three succulents in three small pots. Nearly unkillable.',
    price: 39,
    description: [
      'An echeveria, an aloe and a flowering cactus, each in its own hand-thrown pot. A perfect desk companion for people who forget to water.',
    ],
    care: [
      'As much light as you can give them.',
      'Water thoroughly every 2–3 weeks, then let the soil dry out completely.',
      'Less water in winter.',
    ],
    images: [
      ['succulents', 'Overhead view of green succulents'],
      ['aloe', 'Aloe plant in a mint pot'],
      ['cactusFlower', 'Flowering cactus in a white pot'],
    ],
    category: 'plants',
    occasions: ['birthday', 'just-because'],
    colors: ['green'],
  },
  {
    slug: 'monthly-bloom-subscription',
    name: 'Monthly Bloom Subscription',
    tagline: 'A seasonal bouquet on your doorstep every month.',
    price: 165,
    variants: [
      ['3 months', 'Prepaid', 165],
      ['6 months', 'Prepaid', 310],
      ['12 months', 'Prepaid', 590],
    ],
    description: [
      'The gift that keeps arriving. Each month our head florist designs a bouquet around whatever is most beautiful at the market that week — always seasonal, never repeated.',
      'Deliveries arrive on the first Thursday of each month. Choose your start date at checkout.',
    ],
    care: DEFAULT_CARE,
    images: [
      ['bouquetVase', 'Seasonal mixed bouquet in a glass vase'],
      ['tulipVase', 'Pink tulips in a jar'],
      ['blossom', 'Cherry blossom against blue sky'],
    ],
    category: 'gifts',
    occasions: ['birthday', 'love', 'just-because'],
    colors: ['blush', 'orange', 'white'],
    featured: true,
  },
]

function buildProducts() {
  return PRODUCTS.map((product) => ({
    _id: `product-${product.slug}`,
    _type: 'product',
    name: product.name,
    slug: {_type: 'slug', current: product.slug},
    tagline: product.tagline,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    variants: product.variants?.map(([label, stems, price]) => ({
      _type: 'variant',
      _key: key(),
      label,
      stems,
      price,
    })),
    description: product.description.map(p),
    careNotes: product.care,
    images: product.images.map(([name, alt]) => img(name, alt, true)),
    category: ref(`category-${product.category}`),
    occasions: product.occasions.map((o) => ref(`occasion-${o}`, true)),
    colors: product.colors,
    featured: product.featured ?? false,
    inStock: product.inStock ?? true,
    seo: {_type: 'seo', description: product.tagline},
  }))
}

/* -------------------------------------------------------------------------- */
/*                                   People                                   */
/* -------------------------------------------------------------------------- */

function buildPeople() {
  return [
    {
      _id: 'person-amelia-hart',
      _type: 'person',
      firstName: 'Amelia',
      lastName: 'Hart',
      picture: img('amelia', 'Portrait of Amelia Hart', false, 'image'),
    },
    {
      _id: 'person-marco-reyes',
      _type: 'person',
      firstName: 'Marco',
      lastName: 'Reyes',
      picture: img('marco', 'Portrait of Marco Reyes', false, 'image'),
    },
  ]
}

function buildTestimonials() {
  const items: [string, string, string, ImageName | null][] = [
    ['sofia', 'Sofia Laurent', 'The Blush Hour arrived the morning of our anniversary and my wife cried — in the good way. It lasted nearly two weeks. I have never had flowers like it.', 'sofia'],
    ['elena', 'Elena Marsh', 'Their sympathy arrangement for my grandmother was so gentle and considered. The hand-written card was a small thing that meant everything.', 'elena'],
    ['james', 'James Okafor', 'I have a Monthly Bloom subscription for my studio. Every first Thursday clients ask who does our flowers. Worth every penny.', null],
    ['priya', 'Priya Natarajan', 'Ordered at 11am, delivered by 3pm, wrapped like a present. Petal & Verse is the only florist I use now.', null],
  ]
  return items.map(([id, name, q, image]) => ({
    _id: `testimonial-${id}`,
    _type: 'testimonial',
    name,
    quote: q,
    location: 'Verified customer',
    ...(image ? {image: img(image, `Portrait of ${name}`)} : {}),
  }))
}

/* -------------------------------------------------------------------------- */
/*                                Journal posts                               */
/* -------------------------------------------------------------------------- */

const callout = (slug: string, note: string) => ({
  _type: 'productCallout',
  _key: key(),
  product: ref(`product-${slug}`),
  note,
})

function buildPosts() {
  return [
    {
      _id: 'post-make-cut-flowers-last',
      _type: 'post',
      title: 'How to make cut flowers last two weeks',
      slug: {_type: 'slug', current: 'make-cut-flowers-last'},
      excerpt:
        'Seven small habits from our studio that will double the vase life of almost any bouquet — no magic powders required.',
      coverImage: img('bouquetVase', 'Mixed bouquet in a clear glass vase', false, 'image'),
      date: '2026-09-28T09:00:00.000Z',
      author: ref('person-amelia-hart'),
      tags: ['Flower care', 'Guides'],
      featured: true,
      relatedProducts: [
        ref('product-the-blush-hour', true),
        ref('product-garden-party-roses', true),
        ref('product-tulip-sonnet', true),
      ],
      content: [
        p('People often ask what we put in the water. The honest answer is: nothing special. The difference between flowers that sulk after three days and flowers that glow for two weeks comes down to a handful of small, slightly boring habits. Here they are.'),
        h2('1. Start with a truly clean vase'),
        p('Bacteria are the number one enemy of cut flowers. They clog the stems so water cannot travel up, and the flowers wilt even though the vase is full. Wash your vase with hot soapy water — or a splash of bleach — before every new bouquet. If you would not drink from it, your flowers should not either.'),
        h2('2. Cut stems at an angle, under water if you can'),
        p('Remove **at least 2cm** from each stem with a sharp knife or secateurs. An angled cut creates more surface area for drinking and stops the stem sitting flat on the bottom of the vase. Blunt scissors crush the stem, so use the sharpest blade you own.'),
        {
          ...img('trowel', 'Gardening tools and soil on a grey table', true),
          caption: 'Sharp tools matter more than any flower food.',
        },
        h2('3. Strip every leaf below the waterline'),
        p('Leaves sitting in water rot quickly, and rotting leaves feed bacteria. Before arranging, run your fingers down each stem and remove anything that will end up submerged.'),
        h2('4. Change the water every two days'),
        p('Not a top-up — a full change. Tip it out, rinse the vase, refill with cool water and re-trim the stems by a centimetre. This one habit alone adds days to a bouquet.'),
        quote('A bouquet is a living thing. Treat it like a houseguest: fresh water, a cool room and somewhere out of the sun.'),
        h2('5. Find the right spot'),
        bullet('Keep flowers **away from direct sunlight** and radiators.'),
        bullet('Never place them next to a fruit bowl — ripening fruit releases ethylene, which ages flowers fast.'),
        bullet('Move them somewhere cool overnight. Florists keep stock at 4°C for a reason.'),
        h2('6. Edit as you go'),
        p('Flowers fade at different rates. Pull out anything past its best and re-arrange the rest into a smaller vase. A tight posy of the survivors can look lovelier than the original bouquet.'),
        callout('the-blush-hour', 'Our longest-lasting bouquet, with tips like these printed on the card.'),
        h2('7. Know which flowers are marathon runners'),
        p('Some stems are simply built to last. Chrysanthemums, alstroemeria, carnations and lisianthus routinely reach two weeks. Tulips and garden roses give you a week of drama. Poppies and sweet peas are fleeting — enjoy them for what they are.'),
        p('Follow these seven steps and you will be surprised how long your flowers last. And if you ever have a bouquet from us that does not, just tell us. We will make it right.'),
      ],
    },
    {
      _id: 'post-seasonal-blooms-guide',
      _type: 'post',
      title: 'A florist’s guide to seasonal blooms',
      slug: {_type: 'slug', current: 'seasonal-blooms-guide'},
      excerpt:
        'From hellebores in February to dahlias in September — what is at its best each season, and why buying in season makes for better bouquets.',
      coverImage: img('tulipField', 'Red and white tulips growing in a field', false, 'image'),
      date: '2026-09-14T09:00:00.000Z',
      author: ref('person-amelia-hart'),
      tags: ['Seasonal', 'Guides'],
      relatedProducts: [ref('product-tulip-sonnet', true), ref('product-sun-salutation', true), ref('product-wild-poppy-posy', true)],
      content: [
        p('Almost any flower is available almost any time of year — if you are willing to fly it halfway around the world. We would rather not. Seasonal flowers are fresher, cheaper, kinder to the planet and, frankly, more beautiful, because they have been allowed to grow at their own pace.'),
        h2('Spring: the great awakening'),
        p('After a long winter, the first spring flowers feel like a gift. **Tulips, ranunculus, anemones, hyacinths and blossom branches** arrive in a rush between March and May.'),
        {...img('blossom', 'Pink cherry blossom against a blue sky', true), caption: 'Cherry blossom branches arrive for just three weeks each spring.'},
        callout('tulip-sonnet', 'Spring in a vase.'),
        h2('Summer: abundance'),
        p('Summer is when local growers really shine. Garden roses, sweet peas, cosmos, cornflowers and sunflowers are all at their peak. Bouquets get looser and wilder, and we lean into that meadow feeling.'),
        bullet('**June:** peonies, sweet peas, garden roses'),
        bullet('**July:** cosmos, cornflowers, delphiniums'),
        bullet('**August:** sunflowers, zinnias, early dahlias'),
        {...img('sunflowerField', 'Sunflower against a clear sky', true), caption: 'Late summer belongs to the sunflower.'},
        h2('Autumn: rich and moody'),
        p('As the light softens, colours deepen. **Dahlias** are the undisputed stars of September and October, joined by chrysanthemums, rose hips, amaranthus and turning foliage. This is our favourite time to design.'),
        h2('Winter: structure and scent'),
        p('Winter is quieter but never dull. Hellebores, amaryllis, narcissi and scented paperwhites carry us through, alongside evergreens, berries and dried stems that bring texture and longevity.'),
        quote('Ask your florist what is good this week, then let them run with it. You will always get the best flowers that way.'),
        p('Our Monthly Bloom Subscription is built entirely around this idea — a new bouquet each month designed around whatever is most beautiful at the market that week.'),
        callout('monthly-bloom-subscription', 'Twelve seasons of flowers, one bouquet at a time.'),
      ],
    },
    {
      _id: 'post-language-of-flowers',
      _type: 'post',
      title: 'The language of flowers: what your bouquet is really saying',
      slug: {_type: 'slug', current: 'language-of-flowers'},
      excerpt:
        'The Victorians sent coded messages in petals. A short, slightly romantic guide to floriography — and how to use it today.',
      coverImage: img('redRoses', 'A bed of deep red roses', false, 'image'),
      date: '2026-08-30T09:00:00.000Z',
      author: ref('person-amelia-hart'),
      tags: ['Stories', 'Gifting'],
      relatedProducts: [ref('product-the-single-stem', true), ref('product-velvet-midnight', true), ref('product-white-lily-hymn', true)],
      content: [
        p('In Victorian England, when expressing feelings out loud was rather frowned upon, people spoke through flowers instead. Dictionaries of _floriography_ assigned meaning to hundreds of blooms, and a carefully chosen posy could carry a whole letter.'),
        p('It is a lovely tradition, and one that inspired the name of our studio. Here is a short field guide.'),
        h2('Love, in its many forms'),
        bullet('**Red rose** — deep, romantic love. The classic for a reason.'),
        bullet('**Pink rose** — gratitude, admiration and gentleness.'),
        bullet('**Tulip** — a declaration of love. Red for passion, pink for affection.'),
        bullet('**Forget-me-not** — true love and remembrance.'),
        callout('the-single-stem', 'One red rose says everything.'),
        h2('Friendship and joy'),
        bullet('**Sunflower** — adoration and loyalty; the happiest flower there is.'),
        bullet('**Yellow rose** — friendship. (Not jealousy, as some modern lists claim.)'),
        bullet('**Daisy** — innocence and new beginnings.'),
        {...img('daisy', 'A single white daisy against a black background', true), caption: 'The humble daisy: new beginnings.'},
        h2('Comfort and remembrance'),
        p('White lilies represent the restored innocence of a soul, which is why they are so often chosen for funerals. White chrysanthemums, rosemary (“for remembrance”) and forget-me-nots carry similar meanings.'),
        quote('There is rosemary, that’s for remembrance; pray, love, remember. — Hamlet'),
        h2('A few to avoid'),
        p('If you want to be historically accurate, steer clear of **yellow carnations** (rejection), **striped carnations** (refusal) and **basil**, which apparently meant hatred. We think intent matters more than a dictionary, but it is fun to know.'),
        p('Next time you order, tell us what you want to say — and we will choose stems that say it for you.'),
      ],
    },
    {
      _id: 'post-styling-dried-flowers',
      _type: 'post',
      title: 'Styling dried flowers without the dust',
      slug: {_type: 'slug', current: 'styling-dried-flowers'},
      excerpt:
        'Dried flowers last for months, but they can look tired fast. How to style, refresh and keep everlasting arrangements looking intentional.',
      coverImage: img('kraftBouquet', 'Dried flower bouquet wrapped in kraft paper', false, 'image'),
      date: '2026-08-12T09:00:00.000Z',
      author: ref('person-marco-reyes'),
      tags: ['Dried flowers', 'Styling'],
      relatedProducts: [ref('product-everlasting-kraft-bouquet', true), ref('product-lavender-fields-bundle', true)],
      content: [
        p('Dried flowers had a bit of a renaissance a few years ago, and we are glad they stuck around. They are sustainable, low-maintenance and offer textures you simply cannot get from fresh stems. But there is a fine line between “bohemian” and “dusty”.'),
        h2('Choose a vessel with weight'),
        p('Dried stems are light and top-heavy. A stoneware jug, a heavy glass bottle or a ceramic vase with a narrow neck keeps everything upright and gives the arrangement a sense of permanence.'),
        h2('Mix three textures'),
        numbered('**A feathery filler** — pampas, bunny tails or bleached grasses.'),
        numbered('**A structural line** — ruscus, palm spears or dried eucalyptus.'),
        numbered('**A focal flower** — strawflower, dried roses or a sunflower head.'),
        callout('everlasting-kraft-bouquet', 'All three textures, already arranged.'),
        h2('Keep them out of the sun'),
        p('UV light is what makes dried flowers fade to beige. A shady shelf or a north-facing room will keep colours true for a year or more.'),
        {...img('lavender', 'Rows of lavender at sunset', true), caption: 'Lavender keeps both colour and scent when dried in the dark.'},
        h2('Refresh, don’t replace'),
        bullet('Blast away dust with a hairdryer on its **coolest** setting.'),
        bullet('Swap in a few new stems each season to change the mood.'),
        bullet('Lavender can be revived with a gentle squeeze to release fresh scent.'),
        p('Treated well, a dried bouquet is less a purchase and more a slowly evolving piece of decor. And it will never ask you to change its water.'),
      ],
    },
  ]
}

/* -------------------------------------------------------------------------- */
/*                               Pages & settings                             */
/* -------------------------------------------------------------------------- */

const textBlocks = (...paragraphs: string[]) => paragraphs.map(p)

function buildPages() {
  const home = {
    _id: 'page-home',
    _type: 'page',
    name: 'Home',
    slug: {_type: 'slug', current: 'home'},
    heading: 'Petal & Verse',
    subheading: 'Seasonal flowers, delivered.',
    seo: {
      _type: 'seo',
      title: 'Petal & Verse — Seasonal flowers, hand-tied and delivered',
      description: 'An independent flower studio delivering seasonal bouquets, arrangements, dried flowers and plants.',
    },
    pageBuilder: [
      {
        _type: 'hero',
        _key: key(),
        eyebrow: 'Autumn collection · No. 26',
        heading: 'Flowers, written in *full bloom*.',
        subheading:
          'Seasonal stems from small growers, hand-tied in our studio and delivered the same day — each one finished with a note in your words.',
        primaryButton: button('Shop the collection', '/shop'),
        secondaryButton: button('Read the journal', '/journal'),
        images: [
          img('heroMoody', 'Moody bouquet with red ranunculus and protea', true),
          img('blushBouquet', 'Blush bouquet wrapped in paper', true),
          img('pinkTulip', 'Single pink tulip', true),
        ],
      },
      {
        _type: 'marquee',
        _key: key(),
        words: ['Ranunculus', 'Garden roses', 'Sweet pea', 'Dahlia', 'Anemone', 'Cosmos', 'Hellebore', 'Lisianthus', 'Tulip', 'Peony'],
      },
      {
        _type: 'categoryGrid',
        _key: key(),
        eyebrow: 'Browse',
        heading: 'Something for every *table*.',
        categories: [],
      },
      {
        _type: 'featuredProducts',
        _key: key(),
        eyebrow: 'This week in the studio',
        heading: 'Florist’s favourites',
        intro: 'Our most-loved designs, built around whatever is most beautiful at the market this week.',
        products: [],
        button: button('View all flowers', '/shop'),
      },
      {
        _type: 'storyBlock',
        _key: key(),
        eyebrow: 'Our story',
        heading: 'A small studio that treats flowers like *poetry*.',
        body: textBlocks(
          'Petal & Verse began in 2016 at a market stall with one bucket of tulips and a typewriter for writing gift cards. Today we are a team of nine florists, still working from a single sunlit studio.',
          'We buy directly from small growers, compost every offcut and deliver in reusable boxes. Every bouquet still leaves with a hand-written note.',
        ),
        image: img('shopFront', 'Our flower studio filled with buckets of fresh flowers'),
        secondaryImage: img('gardenRoses', 'Garden roses in a vase'),
        stats: [
          {_key: key(), _type: 'stat', value: '10yrs', label: 'arranging flowers'},
          {_key: key(), _type: 'stat', value: '42', label: 'local growers'},
          {_key: key(), _type: 'stat', value: '0', label: 'single-use plastics'},
        ],
        button: button('Read our story', '/about'),
        imagePosition: 'left',
        tone: 'forest',
      },
      {
        _type: 'testimonialStrip',
        _key: key(),
        eyebrow: 'Kind words',
        heading: 'Letters from our customers',
        testimonials: [],
      },
      {
        _type: 'journalTeaser',
        _key: key(),
        eyebrow: 'The Journal',
        heading: 'Notes from the *flower bench*',
        intro: 'Care guides, seasonal notes and stories from the studio.',
      },
      {
        _type: 'newsletter',
        _key: key(),
        heading: 'Letters, in bloom.',
        body: 'A short monthly letter with what is in season, care tips and first access to limited collections. No spam, ever.',
        image: img('cosmos', 'White cosmos against the sky'),
      },
    ],
  }

  const about = {
    _id: 'page-about',
    _type: 'page',
    name: 'About',
    slug: {_type: 'slug', current: 'about'},
    heading: 'Every bouquet is a *verse*.',
    subheading: 'An independent flower studio, est. 2016',
    seo: {_type: 'seo', description: 'Meet the florists behind Petal & Verse and learn how we work.'},
    pageBuilder: [
      {
        _type: 'storyBlock',
        _key: key(),
        eyebrow: 'Chapter one',
        heading: 'One bucket of tulips and a *typewriter*.',
        body: textBlocks(
          'Amelia Hart started Petal & Verse at a Saturday market with a single bucket of tulips and an old typewriter she used to write poems on gift cards. People came back for the flowers — and for the words.',
          'Ten years later we have a sunlit studio, a small delivery fleet and a team of nine. We still write every card by hand.',
        ),
        image: img('shopFront', 'Flower shop overflowing with blooms'),
        secondaryImage: img('tulipVase', 'Tulips in a glass jar'),
        imagePosition: 'right',
        tone: 'paper',
      },
      {
        _type: 'storyBlock',
        _key: key(),
        eyebrow: 'How we work',
        heading: 'Seasonal, local, and *kind* to the planet.',
        body: textBlocks(
          'We buy from 42 small growers within a day’s drive, and only import when something truly cannot be grown locally. Nothing we use contains floral foam.',
          'Offcuts go to a community compost, deliveries arrive in reusable boxes, and our wrapping paper is made from recycled cotton.',
        ),
        image: img('cosmos', 'White cosmos'),
        secondaryImage: img('trowel', 'Gardening trowel in soil'),
        stats: [
          {_key: key(), _type: 'stat', value: '42', label: 'local growers'},
          {_key: key(), _type: 'stat', value: '100%', label: 'foam-free'},
          {_key: key(), _type: 'stat', value: '9', label: 'florists'},
        ],
        imagePosition: 'left',
        tone: 'blush',
      },
      {
        _type: 'testimonialStrip',
        _key: key(),
        eyebrow: 'Kind words',
        heading: 'What people say',
        testimonials: [],
      },
      {
        _type: 'callToAction',
        _key: key(),
        eyebrow: 'Weddings & events',
        heading: 'Planning something bigger?',
        body: textBlocks('We design flowers for weddings, dinners and brand events. Tell us about your day and we will put together a mood board and quote within 48 hours.'),
        button: button('Get in touch', '/contact'),
        image: img('whiteRose', 'Single white rose'),
        theme: 'light',
        contentAlignment: 'textFirst',
      },
    ],
  }

  const delivery = {
    _id: 'page-delivery',
    _type: 'page',
    name: 'Delivery & Care',
    slug: {_type: 'slug', current: 'delivery'},
    heading: 'Delivery & *care*',
    subheading: 'Everything you need to know',
    pageBuilder: [
      {
        _type: 'infoSection',
        _key: key(),
        heading: 'Delivery',
        subheading: 'Same-day, hand-delivered',
        content: [
          p('Order before **1pm** for same-day delivery, Monday to Saturday. Orders after 1pm are delivered the next delivery day, or on the date you choose at checkout.'),
          bullet('Standard delivery: **$12**'),
          bullet('Free delivery on orders over **$120**'),
          bullet('Deliveries are made between 10am and 6pm'),
          p('If nobody is home, our drivers will leave your flowers in a safe place or with a neighbour and send you a photo.'),
        ],
      },
      {
        _type: 'infoSection',
        _key: key(),
        heading: 'Caring for your flowers',
        subheading: 'Make them last',
        content: [
          numbered('Trim 2cm from each stem at an angle.'),
          numbered('Use a clean vase with fresh, cool water.'),
          numbered('Change the water every two days.'),
          numbered('Keep away from sun, heat and fruit bowls.'),
          p('Want more? Read our full guide on making cut flowers last two weeks in the Journal.'),
        ],
      },
      {
        _type: 'infoSection',
        _key: key(),
        heading: 'Our freshness promise',
        content: [
          p('If your flowers do not last at least seven days with normal care, send us a photo and we will replace them or refund you — no questions asked.'),
        ],
      },
    ],
  }

  return [home, about, delivery]
}

function buildSettings() {
  return {
    _id: 'siteSettings',
    _type: 'settings',
    title: 'Petal & Verse',
    tagline: 'A small flower studio writing letters in petals.',
    description: [
      p('Seasonal flowers from small growers, hand-tied in our studio and delivered with a hand-written note.'),
    ],
    announcement: [
      'Free delivery on orders over $120',
      'Order by 1pm for same-day delivery',
      'Every bouquet hand-tied & foam-free',
      'New: Autumn collection is here',
    ],
    deliveryFee: 12,
    freeDeliveryThreshold: 120,
    contact: {
      email: 'hello@petalandverse.com',
      phone: '+1 (555) 014-2026',
      address: '14 Greenhouse Lane\nPortland, OR 97205',
      hours: 'Mon–Fri · 8am – 6pm\nSat · 9am – 4pm\nSun · Closed',
      instagram: 'https://instagram.com',
      pinterest: 'https://pinterest.com',
    },
    ogImage: {...img('blushBouquet', 'Petal & Verse blush bouquet', false, 'image')},
  }
}

/* -------------------------------------------------------------------------- */
/*                                     Run                                    */
/* -------------------------------------------------------------------------- */

async function run() {
  const {projectId, dataset} = client.config()
  console.log(`Seeding ${projectId}/${dataset}\n\nUploading images…`)
  await uploadImages()

  const docs: Array<{_id: string; _type: string; [key: string]: unknown}> = [
    ...buildCategories(),
    ...buildOccasions(),
    ...buildProducts(),
    ...buildPeople(),
    ...buildTestimonials(),
    ...buildPosts(),
    ...buildPages(),
    buildSettings(),
  ]

  console.log(`\nWriting ${docs.length} documents…`)
  const tx = client.transaction()
  for (const doc of docs) tx.createOrReplace(doc)
  await tx.commit({visibility: 'async'})

  console.log('\n🌷 Done! Open the Studio to see your shop.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
