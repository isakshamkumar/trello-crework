import AuthForm from '@/app/components/AuthForm'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <AuthForm initialMode="signup" />
  )
}

export default page