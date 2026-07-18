/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import * as React from 'react'
import { DeleteAccountModal } from '@/app/dashboard/(dashboard)/(main)/settings/_components/delete-account-modal'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/actions/dashboard-user', () => ({
  DeleteAccount: vi.fn(),
}))

vi.mock('next-auth/react', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    useSession: vi.fn().mockReturnValue({
      data: {
        user: {
          username: 'test_user',
        },
      },
      status: 'authenticated',
    }),
    signOut: vi.fn(),
  }
})

vi.mock('react', async (importOriginal) => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    useActionState: vi.fn().mockReturnValue([null, vi.fn(), false]),
  }
})

vi.mock('@/components/shared', () => ({
  InformationModal: ({ children }: any) => (
    <div data-testid="modal">{children}</div>
  ),
  StatusAlert: ({ text, variant }: any) => (
    <div data-testid="status-alert" data-variant={variant}>
      {text}
    </div>
  ),
  TerminalInput: (props: any) => (
    <input data-testid={`input-${props.name}`} {...props} />
  ),
}))

describe('Delete account modal', () => {
  const mockOnClose = vi.fn()

  it('Should focus the abort button on mount', () => {
    render(<DeleteAccountModal onClose={mockOnClose} />)
    const abortBtn = screen.getByRole('button', {
      name: /Cancel procedure/i,
    })
    expect(abortBtn).toHaveFocus()
  })

  it('Should show processing state when pending', () => {
    vi.mocked(React.useActionState).mockReturnValue([null, vi.fn(), true])

    render(<DeleteAccountModal onClose={mockOnClose} />)

    expect(screen.getByText(/\[ Purging... \]/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Confirm deletion/i }),
    ).toBeDisabled()
  })

  it('should trigger account deletion and display success information', async () => {
    const successState = {
      success: true,
      message: 'Account purged successfully. Disconnecting...',
    }

    vi.mocked(React.useActionState).mockReturnValue([
      successState,
      vi.fn(),
      false,
    ])

    render(<DeleteAccountModal onClose={mockOnClose} />)

    expect(
      screen.getByText(/Account purged successfully. Disconnecting.../i),
    ).toBeInTheDocument()
  })

  it('Should close modal when clicking abort button', () => {
    render(<DeleteAccountModal onClose={mockOnClose} />)

    const abortBtn = screen.getByRole('button', {
      name: /Cancel procedure/i,
    })
    fireEvent.click(abortBtn)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
