import nuxt from '@nuxt/eslint-config'
import prettier from 'eslint-config-prettier'

export default [
  ...nuxt,
  prettier // disables conflicting formatting rules
]
