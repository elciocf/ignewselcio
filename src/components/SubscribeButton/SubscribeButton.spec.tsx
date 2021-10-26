import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { SubscribeButton } from '.'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'


jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton component', () => {

  it('renders correctly', () => { 
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null,false])

    render(<SubscribeButton />)  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument
  })

  it('redirects user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null,false])

    const signInMocked = mocked(signIn) 
    render(<SubscribeButton /> )

     const subscribeButton = screen.getByText('Subscribe now')
     fireEvent.click(subscribeButton)

     expect(signInMocked).toHaveBeenCalled
  })

  it('redirects to posts when user already has a subscription', () => {    
    const useSessionMocked = mocked(useSession)   

    useSessionMocked.mockReturnValueOnce([{
      user: {name: 'John Doe', email: 'john.doe@example.com'},
      activeSubscription: 'fake-active-subscription',
      expires: 'fake-expires'
    },false] as any)

    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton /> )
    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

     expect(pushMock).toHaveBeenCalledWith('/posts')
  })

})

