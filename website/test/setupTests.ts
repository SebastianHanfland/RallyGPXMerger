// Importing expect here globally to be available in all tests
import { expect, afterEach } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react';

expect.extend(matchers)

afterEach(() => {
    cleanup()
})
