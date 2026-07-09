import Input from '../../components/common/Input.jsx'
import Textarea from '../../components/common/Textarea.jsx'
import Button from '../../components/common/Button.jsx'

import { useSettings } from '../../hooks/useSettings.js'

function SettingsPage() {

  const {

    settings,

    loading,

    handleChange,

    saveSettings,

  } = useSettings()

  if (loading) {

    return (

      <div className="flex h-96 items-center justify-center">

        <p className="text-gray-500">

          Loading settings...

        </p>

      </div>

    )

  }

  return (

    <div className="max-w-4xl space-y-10">

      <div>

        <h1 className="text-3xl font-bold">

          Website Settings

        </h1>

        <p className="mt-2 text-gray-500">

          Manage website information.

        </p>

      </div>

      {/* ======================================= */}
      {/* GENERAL */}
      {/* ======================================= */}

      <div className="rounded-lg border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">

          General

        </h2>

        <div className="space-y-5">

          <Input
            id="site_name"
            label="Site Name"
            value={settings.site_name || ''}
            onChange={(e)=>
              handleChange(
                'site_name',
                e.target.value
              )
            }
          />

          <Textarea
            id="site_description"
            label="Site Description"
            rows={3}
            value={settings.site_description || ''}
            onChange={(e)=>
              handleChange(
                'site_description',
                e.target.value
              )
            }
          />

          <Input
            id="primary_color"
            label="Primary Color"
            value={settings.primary_color || ''}
            onChange={(e)=>
              handleChange(
                'primary_color',
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* ======================================= */}
      {/* CONTACT */}
      {/* ======================================= */}

      <div className="rounded-lg border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">

          Contact

        </h2>

        <div className="space-y-5">

          <Input
            id="contact_email"
            label="Contact Email"
            value={settings.contact_email || ''}
            onChange={(e)=>
              handleChange(
                'contact_email',
                e.target.value
              )
            }
          />

          <Input
            id="contact_phone"
            label="Contact Phone"
            value={settings.contact_phone || ''}
            onChange={(e)=>
              handleChange(
                'contact_phone',
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* ======================================= */}
      {/* FOOTER */}
      {/* ======================================= */}

      <div className="rounded-lg border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">

          Footer

        </h2>

        <Textarea
          id="footer_text"
          label="Footer Text"
          rows={2}
          value={settings.footer_text || ''}
          onChange={(e)=>
            handleChange(
              'footer_text',
              e.target.value
            )
          }
        />

      </div>

      {/* ======================================= */}
      {/* SOCIAL MEDIA */}
      {/* ======================================= */}

      <div className="rounded-lg border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">

          Social Media

        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            id="facebook"
            label="Facebook"
            value={settings.facebook || ''}
            onChange={(e)=>
              handleChange(
                'facebook',
                e.target.value
              )
            }
          />

          <Input
            id="instagram"
            label="Instagram"
            value={settings.instagram || ''}
            onChange={(e)=>
              handleChange(
                'instagram',
                e.target.value
              )
            }
          />

          <Input
            id="youtube"
            label="YouTube"
            value={settings.youtube || ''}
            onChange={(e)=>
              handleChange(
                'youtube',
                e.target.value
              )
            }
          />

          <Input
            id="linkedin"
            label="LinkedIn"
            value={settings.linkedin || ''}
            onChange={(e)=>
              handleChange(
                'linkedin',
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* ======================================= */}
      {/* BUTTON */}
      {/* ======================================= */}

      <div className="flex justify-end">

        <Button
          className="bg-gray-900 text-white"
          onClick={saveSettings}
        >

          Save Settings

        </Button>

      </div>

    </div>

  )

}

export default SettingsPage