import {render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import { Async } from '.'

test('it renders correctly', async ()=>{
  render(<Async />)

  /**
   * screen.logTestingPlaygroundURL()
   * 
   * gera uma pagina para facilitar a escolha da property get a ser utilizada para selecionar algo na tela
  */

  expect(screen.getByText('Hello World')).toBeInTheDocument()
  /*await waitFor(()=> {
    return expect(screen.getByText('Button')).toBeInTheDocument()
  })*/

  await waitForElementToBeRemoved(screen.queryByText('Button2'))

})

/**
 * Espera um pouco 
 * expect(await screen.findByText('Button')).toBeInTheDocument()
 * 
 * ja o waitFor .. fica tentando até q.. 
 * 
 * em ambos podemos passar o timeout 
 * 
 * 
 */