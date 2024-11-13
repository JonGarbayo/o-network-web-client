import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import GuestRoute from './GuestRoute'
import AdminRoute from './AdminRoute'
import UserProfile from "../../views/UserProfile"
import Home from '../../views/Home'
import OrganizationCreation from '../../views/OrganizationCreation'
import Administration from '../../views/Administration'
import ProfileSettings from '../../views/ProfileSettings'
import Contact from '../../views/Contact'
import SignUp from '../../views/SignUp'
import ActivityFeed from '../../views/ActivityFeed'
import Error404 from '../../views/Error404'
import useInterceptors from './hook'

export default function Router() {
    // Axios interceptors for all requests
    useInterceptors()

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-organization" element={
                <GuestRoute>
                    <OrganizationCreation />
                </GuestRoute>
            } />
            <Route path="/sign-up" element={
                <GuestRoute>
                    <SignUp />
                </GuestRoute>
            } />
            <Route path="/about" element={<Contact />} />
            <Route
                path={`/:organizationId`}
                element={
                    <ProtectedRoute >
                        <ActivityFeed />
                    </ProtectedRoute>
                }
            />
            <Route
                path={`/:organizationId/user/:userId`}
                element={
                    <ProtectedRoute >
                        <UserProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/:organizationId/user/:userId/edit`}
                element={
                    <ProtectedRoute >
                        <ProfileSettings />
                    </ProtectedRoute>
                }
            />
            <Route
                path={`/:organizationId/admin/members`}
                element={
                    <ProtectedRoute >
                        <AdminRoute>
                            <Administration />
                        </AdminRoute>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/*"
                element={<Error404 />}
            />
        </Routes>
    )
}
