import {useRouter} from 'next/router'

type Props = {
  className?: string
  text?: string
};

export const GoBackLink = (props: Props) => {
  const router = useRouter()
  return (
    <a className={props.className} onClick={() => router.back()}>
      ⃪  {props.text || 'Go back'}
    </a>
  )
}
