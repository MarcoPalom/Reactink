import html2pdf from 'html2pdf.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Quotation, QuotationProduct, QuotationProductMaquila } from 'components/Scripts/Interfaces'
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

// Función genérica para generar PDF de cualquier tabla
export const generatePDFTable = (
  title: string,
  headers: string[],
  data: string[][],
  filename: string,
  orientation: 'portrait' | 'landscape' = 'landscape'
) => {
  const doc = new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: 'letter'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 10
  let yPosition = 15

  // Título
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`INK SPORTS - ${title}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 8

  // Fecha
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const today = new Date().toLocaleDateString('es-ES')
  doc.text(`Ciudad Victoria, Tamaulipas a ${today}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  if (data && data.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [headers],
      body: data,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 66, 66], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    })
  } else {
    doc.text('No hay datos para mostrar', pageWidth / 2, yPosition + 20, { align: 'center' })
  }

  doc.save(`${filename}.pdf`)
}

// Función específica para cotizaciones (mantiene compatibilidad)
export const generatePDF = (quotations?: Quotation[]) => {
  if (!quotations || quotations.length === 0) {
    generatePDFTable('Lista de Cotizaciones', [], [], 'lista_cotizaciones')
    return
  }

  const headers = ['Folio', 'Fecha', 'Cliente', 'Organización', 'Subtotal', 'Impuesto', 'Total', 'En Producción']
  const data = quotations.map((q) => [
    q.id.toString(),
    new Date(q.dateReceipt).toLocaleDateString('es-ES'),
    `${q.client?.name || ''} ${q.client?.surname || ''}`,
    q.client?.organization || '',
    `$${q.subtotal}`,
    `${q.tax}%`,
    `$${q.total}`,
    q.inProduction ? 'Sí' : 'No'
  ])

  generatePDFTable('Lista de Cotizaciones', headers, data, 'lista_cotizaciones')
}

export const generatePDFMODAL = (
  selectedQuotation: Quotation | null,
  modalRef: React.RefObject<HTMLElement>,
  quotationProducts?: QuotationProduct[],
  quotationProductsMaquila?: QuotationProductMaquila[]
) => {
  if (!selectedQuotation) {
    console.error('No hay cotización seleccionada')
    return
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let yPosition = 20

  // Título y folio
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('INK SPORTS', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  doc.setFontSize(14)
  doc.text(`Cotización Folio: ${selectedQuotation.id}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Fecha
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const today = new Date().toLocaleDateString('es-ES')
  doc.text(`Ciudad Victoria, Tamaulipas a ${today}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Información del cliente y cotización
  doc.setFontSize(10)
  const leftColX = margin
  const rightColX = pageWidth / 2 + 10

  // Columna izquierda
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha de recibido:', leftColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(selectedQuotation.dateReceipt).toLocaleDateString('es-ES'), leftColX + 40, yPosition)
  
  // Columna derecha
  doc.setFont('helvetica', 'bold')
  doc.text('Impuesto:', rightColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(`${selectedQuotation.tax}%`, rightColX + 25, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Fecha de expiración:', leftColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(selectedQuotation.expirationDate).toLocaleDateString('es-ES'), leftColX + 40, yPosition)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Total neto:', rightColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(`$${selectedQuotation.netAmount}`, rightColX + 25, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Cliente:', leftColX, yPosition)
  doc.setFont('helvetica', 'normal')
  const clientName = `${selectedQuotation.client.name} ${selectedQuotation.client.surname} - ${selectedQuotation.client.organization}`
  doc.text(clientName.substring(0, 50), leftColX + 18, yPosition)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Avance:', rightColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(`$${selectedQuotation.advance}`, rightColX + 25, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Subtotal:', leftColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(`$${selectedQuotation.subtotal}`, leftColX + 22, yPosition)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Total:', rightColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(`$${selectedQuotation.total}`, rightColX + 25, yPosition)
  yPosition += 15

  // Tabla de productos
  if (quotationProducts && quotationProducts.length > 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Productos', margin, yPosition)
    yPosition += 5

    const productData = quotationProducts.map((product) => [
      product.description || 'Sin descripción',
      product.quantity.toString(),
      `$${parseFloat(String(product.amount)).toFixed(2)}`,
      `${parseFloat(String(product.tax || 0)).toFixed(2)}%`,
      `$${parseFloat(String(product.total)).toFixed(2)}`
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['Descripción', 'Cantidad', 'Precio C/U', 'Impuesto', 'Total']],
      body: productData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [66, 66, 66], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 70 }, // Descripción más ancha
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' }
      }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 10
  }

  // Tabla de productos maquila
  if (quotationProductsMaquila && quotationProductsMaquila.length > 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Productos Maquila', margin, yPosition)
    yPosition += 5

    const maquilaData = quotationProductsMaquila.map((product) => [
      product.description || 'Sin descripción',
      product.quantity.toString(),
      `$${parseFloat(String(product.price_meter || 0)).toFixed(2)}`,
      `${parseFloat(String(product.meters_impression || 0)).toFixed(2)}`,
      `$${parseFloat(String(product.amount)).toFixed(2)}`
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['Descripción', 'Cantidad', 'Precio/M', 'Metros Imp.', 'Monto']],
      body: maquilaData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [66, 66, 66], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' }
      }
    })
  }

  // Guardar PDF
  doc.save(`cotizacion_folio_${selectedQuotation.id}.pdf`)
}

// Función legacy usando html2pdf (backup)
export const generatePDFMODAL_HTML = (
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
