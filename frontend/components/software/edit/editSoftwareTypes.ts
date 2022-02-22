export type ModalProps = {
  open: boolean
  pos?: number
}

export type DeleteModalProps = ModalProps & {
  displayName?: string
}

export type ModalStates<T> = {
  edit: T,
  delete: DeleteModalProps
}
