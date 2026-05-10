// import type { PermissionProps } from '../types'

// interface Props {
//   permissionsMap: Record<string, PermissionProps[]>
//   attachedIds: string[]
//   onChange: (ids: string[]) => void
//   disabled?: boolean
// }

// export function PermissionsGrid({ permissionsMap, attachedIds, onChange, disabled }: Props) {
//   const toggle = (id: string) => {
//     if (attachedIds.includes(id)) {
//       onChange(attachedIds.filter((x) => x !== id))
//     } else {
//       onChange([...attachedIds, id])
//     }
//   }

//   const toggleGroup = (permissions: PermissionProps[]) => {
//     const ids = permissions.map((p) => p.id)
//     const allSelected = ids.every((id) => attachedIds.includes(id))
//     if (allSelected) {
//       onChange(attachedIds.filter((id) => !ids.includes(id)))
//     } else {
//       const merged = Array.from(new Set([...attachedIds, ...ids]))
//       onChange(merged)
//     }
//   }

//   return (
//     <div className="space-y-4">
//       {Object.entries(permissionsMap).map(([group, permissions]) => {
//         const ids = permissions.map((p) => p.id)
//         const allSelected = ids.every((id) => attachedIds.includes(id))
//         const someSelected = ids.some((id) => attachedIds.includes(id))

//         return (
//           <div key={group} className="border border-base-300 rounded-lg overflow-hidden">
//             {/* Group header */}
//             <div className="flex items-center gap-3 px-4 py-2 bg-base-200">
//               <input
//                 type="checkbox"
//                 className="checkbox checkbox-sm checkbox-primary"
//                 checked={allSelected}
//                 ref={(el) => {
//                   if (el) el.indeterminate = !allSelected && someSelected
//                 }}
//                 onChange={() => toggleGroup(permissions)}
//                 disabled={disabled}
//               />
//               <span className="font-semibold text-sm capitalize">{group}</span>
//               <span className="ml-auto text-xs text-base-content/50">
//                 {ids.filter((id) => attachedIds.includes(id)).length}/{ids.length}
//               </span>
//             </div>

//             {/* Individual permissions */}
//             <div className="divide-y divide-base-200">
//               {permissions.map((perm) => {
//                 const action = perm.name.split('.').slice(1).join('.') || perm.name
//                 return (
//                   <label
//                     key={perm.id}
//                     className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-base-100 transition-colors"
//                   >
//                     <input
//                       type="checkbox"
//                       className="checkbox checkbox-sm checkbox-primary"
//                       checked={attachedIds.includes(perm.id)}
//                       onChange={() => toggle(perm.id)}
//                       disabled={disabled}
//                     />
//                     <span className="text-sm font-mono text-base-content/80">{perm.name}</span>
//                     <span className="ml-auto badge badge-ghost badge-sm capitalize">{action}</span>
//                   </label>
//                 )
//               })}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }