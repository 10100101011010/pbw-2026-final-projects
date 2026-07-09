import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'

import { useProfile } from '../../hooks/useProfile.js'

function ProfilePage() {

  const {

    profile,

    loading,

    handleChange,

    saveProfile,

    newPassword,

    setNewPassword,

    updatePassword,

  } = useProfile()

  if (loading) {

    return (

      <div className="flex h-96 items-center justify-center">

        <p className="text-gray-500">

          Loading profile...

        </p>

      </div>

    )

  }

  return (

    <div className="max-w-4xl space-y-8">

      {/* ===================================== */}
      {/* PAGE HEADER */}
      {/* ===================================== */}

      <div>

        <h1 className="text-3xl font-bold">

          Profile

        </h1>

        <p className="mt-2 text-gray-500">

          Manage administrator account.

        </p>

      </div>

      {/* ===================================== */}
      {/* PROFILE */}
      {/* ===================================== */}

      <div className="rounded-lg border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">

          Personal Information

        </h2>

        <div className="space-y-5">

          <Input
            id="full_name"
            label="Full Name"
            value={profile.full_name || ''}
            onChange={(e)=>
              handleChange(
                'full_name',
                e.target.value
              )
            }
          />

          <Input
            id="email"
            label="Email"
            value={profile.email || ''}
            onChange={(e)=>
              handleChange(
                'email',
                e.target.value
              )
            }
          />

          <Input
            id="phone"
            label="Phone Number"
            value={profile.phone || ''}
            onChange={(e)=>
              handleChange(
                'phone',
                e.target.value
              )
            }
          />

          <Input
            id="avatar_url"
            label="Avatar URL"
            value={profile.avatar_url || ''}
            onChange={(e)=>
              handleChange(
                'avatar_url',
                e.target.value
              )
            }
          />

          <div className="flex justify-end">

            <Button

              className="bg-gray-900 text-white"

              onClick={saveProfile}

            >

              Save Profile

            </Button>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* PASSWORD */}
      {/* ===================================== */}

      <div className="rounded-lg border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">

          Change Password

        </h2>

        <div className="space-y-5">

          <Input
            id="password"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e)=>
              setNewPassword(
                e.target.value
              )
            }
          />

          <div className="flex justify-end">

            <Button

              className="bg-blue-600 text-white"

              onClick={updatePassword}

            >

              Update Password

            </Button>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* ACCOUNT INFO */}
      {/* ===================================== */}

      <div className="rounded-lg border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">

          Account Information

        </h2>

        <div className="space-y-3 text-sm">

          <p>

            <strong>Role :</strong>{' '}

            {profile.role}

          </p>

          <p>

            <strong>Created At :</strong>{' '}

            {new Date(
              profile.created_at
            ).toLocaleString()}

          </p>

          <p>

            <strong>Last Updated :</strong>{' '}

            {new Date(
              profile.updated_at
            ).toLocaleString()}

          </p>

        </div>

      </div>

    </div>

  )

}

export default ProfilePage