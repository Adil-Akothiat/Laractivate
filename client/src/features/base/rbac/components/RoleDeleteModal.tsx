import { useRef, useEffect } from 'react'
import { useRoles } from '../index';
import type { RoleProps } from '../types'
import { getErrorsMessages } from '@/app/utils';
import { Button } from '@/components';

interface Props {
  role: RoleProps
  onSuccess: () => void
  onCancel: () => void
}

export function RoleDeleteModal({ role, onSuccess, onCancel }: Props) {
  const { mutate:deleteRole, isPending, isError, error } = useRoles.delete()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  const handleDelete = () => {
    deleteRole(role.id, {
      onSuccess: () => {
        onSuccess()
      }
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-base-content/80">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-base-content">"{role.name}"</span>?
        This action cannot be undone.
      </p>

      {(role.users_count ?? 0) > 0 && (
        <div className="alert alert-warning text-sm py-2">
          <span>
            This role is assigned to {role.users_count} user
            {role.users_count !== 1 ? 's' : ''}. Remove those assignments first.
          </span>
        </div>
      )}

      {error && (
        <div className="alert alert-error text-sm py-2">
          <span>{getErrorsMessages(error)}</span>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          ref={cancelRef}
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </button>
        <Button
          variant="error"
          onClick={handleDelete}
          loading={isPending}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}