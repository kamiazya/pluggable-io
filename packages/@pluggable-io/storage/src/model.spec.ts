import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Storage, StorageRegistory } from './models.js'
import { PluginNotLoadedError } from '@pluggable-io/core'

describe('StorageRegistory', () => {
  let registyory: StorageRegistory
  let storage: Storage

  beforeEach(() => {
    registyory = new StorageRegistory()
    storage = {
      exists: vi.fn(),
      delete: vi.fn(),
      open: vi.fn(),
      list: vi.fn(),
    }
    registyory.load('test:', {
      async build() {
        return storage
      },
    })
  })

  describe('open method', () => {
    it('should open a file from storage', async () => {
      const fromSpy = vi.spyOn(registyory, 'from')

      await registyory.open('test://origin/package.json')
      expect(fromSpy).toBeCalledWith('test://origin/')
      expect(storage.open).toBeCalledWith('/package.json', undefined)
    })

    it('should throw an error if the scheme is not loaded', async () => {
      await expect(registyory.open('unknown://origin/package.json')).rejects.toThrow(PluginNotLoadedError)
    })

    it('should propagation options to open method of storage', async () => {
      await registyory.open('test://origin/package.json', { read: true })
      expect(storage.open).toBeCalledWith('/package.json', { read: true })
    })
  })
})
