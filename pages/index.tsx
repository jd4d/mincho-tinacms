import {
  getGithubFile,
  GetGithubFileOptions,
  getGithubPreviewProps,
  parseJson,
} from 'next-tinacms-github'
import { useGithubJsonForm } from 'react-tinacms-github'
import { usePlugin, useFormScreenPlugin } from 'tinacms'
import { GetStaticProps } from 'next'
import { InlineForm, InlineText, InlineImage } from 'react-tinacms-inline'

export default function Home(props) {
  const formOptions = {
    label: 'Home Page',
    fields: [
      { name: 'title', component: 'text' },
      {
        name: 'hero_image',
        component: 'image',
        parse: (media) => media.id,
        uploadDir: () => '/images',
      },
    ],
  }
  const globalFormOptions = {
    label: 'Page Globals',
    fields: [{ name: 'background-color', component: 'text' }],
  }
  const [formData, form] = useGithubJsonForm(props.homeFile, formOptions)
  usePlugin(form)

  const [globals, globalsForm] = useGithubJsonForm(
    props.globalsFile,
    globalFormOptions
  )
  useFormScreenPlugin(globalsForm)

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
    const homeFile = await getGithubFile({
      ...previewData,
      fileRelativePath: 'content/globals.json',
      parse: parseJson,
    })

    const globalsFile = await getGithubFile({
      ...previewData,
      fileRelativePath: 'content/home.json',
      parse: parseJson,
    })

    return {
      props: {
        preview,
        homeFile,
        globalsFile,
      },
    }
  }
  return {
    props: {
      globalsFile: {
        fileRelativePath: 'content/globals.json',
        data: (await import('../content/globals.json')).default,
      },
      homeFile: {
        fileRelativePath: 'content/home.json',
        data: (await import('../content/home.json')).default,
      },
    },
  }
}
