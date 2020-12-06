import { getGithubPreviewProps, parseJson } from 'next-tinacms-github'
import { useGithubJsonForm } from 'react-tinacms-github'
import { usePlugin, useScreenPlugin } from 'tinacms'
import { GetStaticProps } from 'next'
import { InlineForm, InlineText, InlineImage } from 'react-tinacms-inline'

export default function Home(props) {
  console.log(props)
  const formOptions = {
    label: 'Home Page',
    fields: [
      { name: 'title', component: 'text' },
      { name: 'hero_image', component: 'image' },
    ],
  }
  const globalFormOptions = {
    label: 'Page Globals',
    fields: [{ name: 'background-color', component: 'text' }],
  }
  const [formData, form] = useGithubJsonForm(props.homeFile.file, formOptions)
  usePlugin(form)

  const [globals, globalsForm] = useGithubJsonForm(
    props.globalsFile.file,
    globalFormOptions
  )
  useScreenPlugin(globalsForm)

  return (
    <div style={{ backgroundColor: globals['background-color'] }}>
      <InlineForm form={form}>
        <h1 style={{ color: 'red' }}>
          <InlineText name="title" />
        </h1>
        <InlineImage
          name="hero_image"
          parse={(media) => media.id}
          uploadDir={() => '/images'}
          alt="hero-image"
        />
      </InlineForm>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async function ({
  preview,
  previewData,
}) {
  if (preview) {
    return {
      props: {
        homeFile: await getGithubPreviewProps({
          ...previewData,
          fileRelativePath: 'content/home.json',
          parse: parseJson,
        }),
        globalsFile: await getGithubPreviewProps({
          ...previewData,
          fileRelativePath: 'content/globals.json',
          parse: parseJson,
        }),
      },
    }
  }
  return {
    props: {
      homeFile: {
        sourceProvider: null,
        error: null,
        preview: false,
        file: {
          fileRelativePath: 'content/home.json',
          data: (await import('../content/home.json')).default,
        },
      },
      contentFile: {
        sourceProvider: null,
        error: null,
        preview: false,
        file: {
          fileRelativePath: 'content/globals.json',
          data: (await import('../content/globals.json')).default,
        },
      },
    },
  }
}
