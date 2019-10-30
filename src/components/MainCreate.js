import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import {
  changeSnippetName,
  changeSnippetCode,
  changeSnippetList,
  changeSnippetLanguage,
  addNewSnippet,
  setViewMode,
  resetSnippetInputs
} from '../actions'

import Editor from './Editor'
import Button from './Button'

const Container = styled.div`
  flex-grow: 1;
  min-height: 100vh;
`

const Header = styled.div`
  margin: 0 25px;
  position: relative;
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
`

const ActionsContainer = styled.div`
  display: flex;
  position: relative;
`

const Title = styled.h3`
  font-size: 20px;
  font-weight: 500;
`

const TitleError = styled(Title)`
  color: darkred;
`

const SubHeader = styled.div`
  display: flex;
  flex-grow: 1;
  margin: 0 25px;
  align-items: center;
  padding: 15px 0;
  justify-content: space-between;
`

const Input = styled.input`
  flex-grow: 1;
  margin: 0 20px;
  padding: 10px;
`

const Select = styled.select`
  min-width: 150px;
  padding: 10px;
`

const StyledButton = styled(Button)`
  &:not(:last-child) {
    margin-right: 20px;
  }
`

const EditorContainer = styled.div`
  margin: 25px;
`

const MainCreate = ({ snippets, lists, changeSnippetCode, changeSnippetName, changeSnippetList, changeSnippetLanguage, addNewSnippet, resetSnippetInputs, setViewMode }) => {

  const { allLists } = lists
  const { codeInput, nameInput, error, allLanguages, languageInput } = snippets

  const options = { theme: 'material', lineNumbers: true }

  const handleCancel = () => {
    setViewMode('read')
    resetSnippetInputs()
  }

  return (
    <Container>
      <Header>
        { error 
          ? <TitleError>{error}</TitleError>
          : <Title>New Snippet</Title>
        }
        <ActionsContainer>
          <StyledButton handleOnClick={handleCancel} label="Cancel" />
          <StyledButton handleOnClick={addNewSnippet} label="Save" />
        </ActionsContainer>
      </Header>

      <div>
        <SubHeader>
          {
            allLanguages &&
            <Select onChange={e => changeSnippetLanguage(e.target.value)}>
              <option value="">Select language</option>
              {allLanguages.map(x => <option key={`lang-${x}`} value={x}>{x}</option>)}
            </Select>
          }

          <Input 
            type="text" 
            onChange={e => changeSnippetName(e.target.value)} 
            placeholder="Enter a title for this snippet" 
            value={nameInput} 
          />

          {
            allLists &&
            <Select onChange={e => changeSnippetList(e.target.value)}>
              <option value="">Select list</option>
              {allLists.map(x => <option key={x.createdAt} value={x.createdAt}>{x.name}</option>)}
            </Select>
          }
        </SubHeader>

        <EditorContainer>
          <Editor 
            handleChange={changeSnippetCode} 
            value={codeInput} 
            options={options} 
            lang={languageInput}
          />
        </EditorContainer>
      </div>
    </Container>
  )
}

const mapStateToProps = state => ({
  snippets: state.snippets,
  lists: state.lists
})

const mapDispatchToProps = {
  changeSnippetName,
  changeSnippetCode,
  changeSnippetList,
  changeSnippetLanguage,
  addNewSnippet,
  setViewMode,
  resetSnippetInputs
}

export default connect(mapStateToProps, mapDispatchToProps)(MainCreate)