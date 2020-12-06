import { getGithubPreviewProps, parseJson } from 'next-tinacms-github'
import { useGithubJsonForm } from 'react-tinacms-github'
import { useCMS, useForm, usePlugin } from 'tinacms'
import { GetStaticProps } from 'next'
import { InlineForm, InlineText, InlineImage } from 'react-tinacms-inline'
import styled from 'styled-components'

export default function Home(props) {
  console.log(props)
  const formOptions = {
    label: 'Home Page',
    fields: [
      { name: 'title', component: 'text' },
      { name: 'hero_image', component: 'image' },
    ],
  }
  const [formDatag, form] = useGithubJsonForm(props.file, formOptions)
  usePlugin(form)
  const cms = useCMS()

  return (
    <div className="container">
      <InlineForm form={form}>
        <h1>
          <StyledText name="title" />
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
const StyledText = styled(InlineText)`
  color: green;
`

export const getStaticProps: GetStaticProps = async function ({
  preview,
  previewData,
}) {
  if (preview) {
    return getGithubPreviewProps({
      ...previewData,
      fileRelativePath: 'content/home.json',
      parse: parseJson,
    })
  }
  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      file: {
        fileRelativePath: 'content/home.json',
        data: (await import('../content/home.json')).default,
      },
    },
  }
}
