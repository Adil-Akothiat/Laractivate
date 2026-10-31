// import { Outlet, useParams, useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

// export function WorkspaceGuard() {
//   const { workspaceSlug } = useParams();
//   const navigate = useNavigate();

//   // 1. Show loading state while user/workspaces are being fetched
//   if (isLoadingWorkspaces) {
//     return <div className="flex h-screen items-center justify-center">Loading workspace...</div>;
//   }

//   // 2. Find if the workspace slug exists in the user's allowed workspaces list
//   const currentWorkspace = workspaces?.find((w) => w.slug === workspaceSlug);

//   useEffect(() => {
//     // If the workspace slug is invalid or the user doesn't have access to it,
//     // redirect them to their workspace selector page
//     if (!currentWorkspace && workspaces?.length > 0) {
//       navigate('/workspaces', { replace: true });
//     }
//   }, [currentWorkspace, workspaces, navigate]);

//   if (!currentWorkspace) {
//     return null; // Prevent rendering child components while redirecting
//   }

//   // 3. Render the nested workspace pages if validation passes
//   return <Outlet context={{ currentWorkspace }} />;
// }