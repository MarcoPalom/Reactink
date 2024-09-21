import html2pdf from 'html2pdf.js'
import { Quotation } from 'components/Scripts/Interfaces'
import ButtDisables from 'assets/img/AceptBlocked.png'
import SendButt from 'assets/img/Send.png'
import TaxBloq from 'assets/img/TaxBloq.jpg'

export const disciplines = [
  'Futbol soccer',
  'Beisbol',
  'Tochito',
  'Voleibol',
  'Basquetball',
  'Ciclismo',
  'Carrera',
  'Pesca',
  'Entrenador',
  'Playera',
  'Entrenamiento'
]

export const cloths = [
  'Pepito',
  'Antoly',
  'Inter70',
  'Micropique',
  'MakyPlus',
  'Paris',
  'Super Licra',
  'Cardigan',
  'Atlos',
  'Licra',
  'Jumanji',
  'Manchester'
]

export const neckForms = [
  'Redondo',
  'Cuello V',
  'Tipo Polo',
  'Con Cierre',
  'Boton',
  'Tipo polo sublimado',
  'Cuello V sublimado'
]

export const neckTypes = ['Sublimado', 'Tela teñida', 'Cardigan']

export const sleeveForms = [
  'Corta',
  'Rangla',
  'Corta C/Puño',
  'Larga',
  'sin manga',
  'Rangla C/Puño'
]

export const sleeveTypes = ['Subilmado', 'Tela Teñida']

export const cuffs = ['SI', 'NO']

export const cuffsTypes = ['Subilmado', 'Tela Teñida']

export const sizes = [
  '6',
  '8',
  '12',
  '14',
  '16',
  '18',
  'CH',
  'M',
  'G',
  'XG',
  'XXG',
  'XXXG',
  '4XG'
]

export const shortLooks = ['SI', 'Laterales', 'Puño', 'NO']
export const sections = ['SI', 'NO']

export const genderMap: { [key: number]: string } = {
  1: 'H',
  2: 'M'
}

export const contentBlockAceptEdit = (
  <div className="flex flex-col items-center justify-center">
    <div className="flex flex-col items-center">
      <img className="w-20 mb-2" src={ButtDisables} alt="" />
      <img className="w-40 mb-2" src={TaxBloq} alt="" />
      <p className="text-center">
        En caso de haber editado cualquier dato de la tabla de productos, el{' '}
      </p>
      <p className="text-center">
        {' '}
        botón de aceptar se bloquea por precaución. Recuerda dar clic en el{' '}
      </p>
      <p className="text-center">
        {' '}
        botón de enviar para desbloquear el botón aceptar.
      </p>
      <img className="w-10 mb-2" src={SendButt} alt="" />
      <p className="text-center">
        {' '}
        En caso de añadir un avance, por razones de lógica, lo más óptimo es que{' '}
      </p>
      <p className="text-center">
        {' '}
        no se agregue un impuesto nuevo. En caso de haberse equivocado, basta{' '}
      </p>
      <p className="text-center">
        {' '}
        con cerrar el formulario y el campo de impuesto volverá a estar{' '}
      </p>
      <p className="text-center">
        {' '}
        disponible. Lo ideal es llenar el formulario en orden.{' '}
      </p>
    </div>
  </div>
)

const TodayDate = () => {
  const today = new Date()
  const formattedDate = today.toLocaleDateString()

  return <h1>{formattedDate}</h1>
}

export default TodayDate

export const generatePDF = () => {
  const element = document.getElementById('PDFtable')
  const actionColumns = document.querySelectorAll('#PDFtable .action-column')
  actionColumns.forEach((column) => {
    column.classList.add('hidden')
  })

  const options = {
    margin: 0.5,
    filename: 'Tabla-no:',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 1000 },
    jsPDF: {
      unit: 'cm',
      format: 'letter',
      orientation: 'landscape'
    },
    pagebreak: { mode: 'avoid-all' },
    html2pdf: {
      dpi: 300
    }
  }

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      actionColumns.forEach((column) => {
        column.classList.remove('hidden')
      })
    })
}

export const generatePDFMODAL = (
  selectedQuotation: Quotation | null,
  modalRef: React.RefObject<HTMLElement>
) => {
  const element = modalRef.current
  const options = {
    margin: 0.5,
    filename: `cotizacion_folio_${selectedQuotation?.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }

  html2pdf().from(element).set(options).save()
}
