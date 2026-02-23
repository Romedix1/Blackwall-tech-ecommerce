import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { NavbarSearch } from '@/app/components/layout/navbar/navbar-search'
import '@testing-library/jest-dom'

describe('NavbarSearch Shortcut', () => {
  it('should focus the input field when Ctrl+K is pressed', () => {
    render(<NavbarSearch variant="navigation" />)

    const searchInput = screen.getByRole('textbox')

    expect(searchInput).not.toHaveFocus()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    expect(searchInput).toHaveFocus()
  })
})
