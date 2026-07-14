import {
  componentCategories as manifestComponentCategories,
  componentManifest,
  componentRegistryBaseUrl as manifestComponentRegistryBaseUrl,
} from './component-manifest.mjs'

export type ComponentCategoryId =
  (typeof manifestComponentCategories)[number]['id']

export type ComponentPreviewKind = (typeof componentManifest)[number]['slug']

export interface ComponentCategory {
  id: ComponentCategoryId
  name: string
  description: string
}

export interface ComponentProp {
  name: string
  type: string
  defaultValue: string
  description: string
}

export interface ComponentRegistry {
  name: string
  url: string
  dependencies: readonly string[]
}

export interface ComponentReference {
  label: string
  url: string
}

export interface ComponentSample {
  slug: ComponentPreviewKind
  categoryId: ComponentCategoryId
  title: string
  description: string
  status: 'Draft' | 'Ready'
  installCommand: string
  filePath: string
  preview: {
    kind: ComponentPreviewKind
    label: string
  }
  registry?: ComponentRegistry
  reference: ComponentReference
  code: string
  usage: string
  props: readonly ComponentProp[]
}

export const componentRegistryBaseUrl = manifestComponentRegistryBaseUrl

export const componentCategories: readonly ComponentCategory[] =
  manifestComponentCategories

export const componentSamples: readonly ComponentSample[] =
  componentManifest.map((component) => ({
    slug: component.slug,
    categoryId: component.categoryId,
    title: component.title,
    description: component.description,
    status: 'Ready',
    installCommand: `pnpm dlx shadcn@latest add ${componentRegistryBaseUrl}/${component.slug}.json`,
    filePath: `src/components/${component.slug}.tsx`,
    preview: {
      kind: component.slug,
      label: component.title,
    },
    registry: {
      name: component.slug,
      url: `/r/${component.slug}.json`,
      dependencies: component.registry.dependencies,
    },
    reference: component.reference,
    code: component.usage,
    usage: component.usage,
    props: component.props,
  }))

const mobileHiddenComponentSlugs = new Set<ComponentPreviewKind>(
  componentManifest
    .filter(
      (component) =>
        'hiddenOnMobile' in component && component.hiddenOnMobile === true
    )
    .map((component) => component.slug)
)

export function isComponentHiddenOnMobile(slug: ComponentPreviewKind) {
  return mobileHiddenComponentSlugs.has(slug)
}

export function getComponentSampleBySlug(slug: string) {
  return componentSamples.find((sample) => sample.slug === slug) ?? null
}
