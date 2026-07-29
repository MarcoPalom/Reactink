import html2pdf from 'html2pdf.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import axios from 'axios'
import {
  Quotation,
  QuotationProduct,
  QuotationProductMaquila,
  CuttingOrderData,
  FormDataShirtView,
  FormDataShortView
} from 'components/Scripts/Interfaces'
import ButtDisables from 'assets/img/AceptBlocked.png'
import SendButt from 'assets/img/Send.png'
import TaxBloq from 'assets/img/TaxBloq.jpg'
import Logo from 'assets/img/logo.png'

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
  '10',
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

export const formatCurrency = (value: number | string | undefined | null): string => {
  const n = Number(value ?? 0)
  return `$${(isNaN(n) ? 0 : n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

let logoDataUrlCache: string | null = null
const getLogoDataUrl = async (): Promise<string> => {
  if (logoDataUrlCache) return logoDataUrlCache
  const res = await fetch(Logo)
  const blob = await res.blob()
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      logoDataUrlCache = reader.result as string
      resolve(logoDataUrlCache)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

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

export const generatePDFMODAL = async (
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
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15

  // Header: logo a la izquierda, texto a su derecha
  const logoDataUrl = await getLogoDataUrl()
  const logoW = 40
  const logoH = 15
  doc.addImage(logoDataUrl, 'PNG', margin, 12, logoW, logoH)

  const headerTextX = margin + logoW + 5
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('INK SPORTS', headerTextX, 18)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Cotización Folio: ${selectedQuotation.id}`, headerTextX, 24)

  doc.setFontSize(10)
  const today = new Date().toLocaleDateString('es-ES')
  doc.text(`Ciudad Victoria, Tamaulipas a ${today}`, headerTextX, 29)

  let yPosition = 40

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
  doc.text(formatCurrency(selectedQuotation.netAmount), rightColX + 25, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Cliente:', leftColX, yPosition)
  doc.setFont('helvetica', 'normal')
  const clientName = `${selectedQuotation.client.name} ${selectedQuotation.client.surname} - ${selectedQuotation.client.organization}`
  doc.text(clientName.substring(0, 50), leftColX + 18, yPosition)

  doc.setFont('helvetica', 'bold')
  doc.text('Avance:', rightColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(formatCurrency(selectedQuotation.advance), rightColX + 25, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Subtotal:', leftColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(formatCurrency(selectedQuotation.subtotal), leftColX + 22, yPosition)

  doc.setFont('helvetica', 'bold')
  doc.text('Total:', rightColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(formatCurrency(selectedQuotation.total), rightColX + 25, yPosition)
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
      formatCurrency(product.amount),
      `${parseFloat(String(product.tax || 0)).toFixed(2)}%`,
      formatCurrency(product.total)
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
      formatCurrency(product.price_meter || 0),
      `${parseFloat(String(product.meters_impression || 0)).toFixed(2)}`,
      formatCurrency(product.amount)
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

    yPosition = (doc as any).lastAutoTable.finalY + 10
  }

  // Pie con datos de la empresa (igual al modal)
  const footerEstimatedHeight = 30
  if (yPosition + footerEstimatedHeight > pageHeight - margin) {
    doc.addPage()
    yPosition = margin
  } else {
    yPosition += 5
  }

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('1 Y 2 Hidalgo, Zona Centro Cd. Victoria, Tamaulipas', pageWidth - margin, yPosition, { align: 'right' })
  yPosition += 5
  doc.text('Tel: (834)-312-16-58   Whatsapp: 8341330078', pageWidth - margin, yPosition, { align: 'right' })
  yPosition += 7

  doc.setFontSize(8)
  const contactText =
    'Si usted tiene alguna pregunta sobre esta cotización, por favor, póngase en contacto con nosotros ' +
    'INK SUBLIMACIÓN, al 31 2 16 58 o a nuestro E-mail inkcomprasvic@gmail.com'
  const wrapped = doc.splitTextToSize(contactText, pageWidth - margin * 2)
  doc.text(wrapped, pageWidth - margin, yPosition, { align: 'right' })

  // Guardar PDF
  doc.save(`cotizacion_folio_${selectedQuotation.id}.pdf`)
}

// Descarga una imagen remota y la convierte a data URL (base64) para embeber en jsPDF.
// Usa axios con auth header porque el endpoint de imágenes requiere Bearer token.
const fetchImageAsDataUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      responseType: 'blob'
    })
    const blob = response.data as Blob
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error fetching image for PDF:', url, error)
    return null
  }
}

const detectImageFormat = (dataUrl: string): 'PNG' | 'JPEG' => {
  const match = /^data:image\/(png|jpe?g)/i.exec(dataUrl)
  return match && match[1].toLowerCase() === 'png' ? 'PNG' : 'JPEG'
}

const isShirtView = (
  p: FormDataShirtView | FormDataShortView
): p is FormDataShirtView => 'clothFrontShirtId' in p

export type CuttingOrderProductGroup = (FormDataShirtView | FormDataShortView) & {
  originals: (FormDataShirtView | FormDataShortView)[]
}

export const generatePDFCuttingOrder = async (
  order: CuttingOrderData,
  groupedProducts: CuttingOrderProductGroup[],
  shirtImageUrl: string | null,
  shortImageUrl: string | null,
  getMaterialName: (id: number) => string
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15

  // Descarga en paralelo el logo + imágenes de diseño + imagen por grupo.
  const productImageUrls = groupedProducts.map((p) =>
    isShirtView(p) ? shirtImageUrl : shortImageUrl
  )
  const [logoDataUrl, shirtDataUrl, shortDataUrl, ...productDataUrls] = await Promise.all([
    getLogoDataUrl(),
    shirtImageUrl ? fetchImageAsDataUrl(shirtImageUrl) : Promise.resolve(null),
    shortImageUrl ? fetchImageAsDataUrl(shortImageUrl) : Promise.resolve(null),
    ...productImageUrls.map((url) => (url ? fetchImageAsDataUrl(url) : Promise.resolve(null)))
  ])

  const ensureSpace = (needed: number, currentY: number): number => {
    if (currentY + needed > pageHeight - margin - 5) {
      doc.addPage()
      return margin
    }
    return currentY
  }

  const safeAddImage = (
    dataUrl: string | null,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    if (!dataUrl) return
    try {
      doc.addImage(dataUrl, detectImageFormat(dataUrl), x, y, w, h)
    } catch (e) {
      console.error('addImage failed', e)
    }
  }

  // Header: logo izquierda + título derecha
  const logoW = 40
  const logoH = 15
  doc.addImage(logoDataUrl, 'PNG', margin, 12, logoW, logoH)

  const headerTextX = margin + logoW + 5
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('INK SPORTS', headerTextX, 18)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Orden de Corte', headerTextX, 24)
  doc.setFontSize(10)
  const today = new Date().toLocaleDateString('es-ES')
  doc.text(`Ciudad Victoria, Tamaulipas a ${today}`, headerTextX, 29)

  let yPosition = 40

  // Información general en dos columnas
  const client = order.quotation?.client
  const clientName = client ? `${client.name || ''} ${client.surname || ''}`.trim() : ''
  const organization = client?.organization || ''
  const dateReceiptStr = order.dateReceipt
    ? new Date(order.dateReceipt).toLocaleDateString('es-ES')
    : ''
  const dueDateStr = order.dueDate ? new Date(order.dueDate).toLocaleDateString('es-ES') : ''

  doc.setFontSize(10)
  const leftColX = margin
  const rightColX = pageWidth / 2 + 5
  const labelOffset = 45

  doc.setFont('helvetica', 'bold')
  doc.text('Folio Cotización:', leftColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(String(order.quotationId ?? ''), leftColX + labelOffset, yPosition)
  doc.setFont('helvetica', 'bold')
  doc.text('N° Orden de Corte:', rightColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(String(order.id ?? ''), rightColX + labelOffset, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Cliente:', leftColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(clientName.substring(0, 40) || '-', leftColX + labelOffset, yPosition)
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha Recepción:', rightColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(dateReceiptStr || '-', rightColX + labelOffset, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Organización:', leftColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text((organization || '-').substring(0, 40), leftColX + labelOffset, yPosition)
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha Entrega:', rightColX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(dueDateStr || '-', rightColX + labelOffset, yPosition)
  yPosition += 10

  // Sección de imágenes de diseño
  if (shirtDataUrl || shortDataUrl) {
    yPosition = ensureSpace(65, yPosition)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Diseños', margin, yPosition)
    yPosition += 5

    const imgW = 50
    const imgH = 55
    const gap = 10
    const totalW = (shirtDataUrl ? imgW : 0) + (shortDataUrl ? imgW : 0) + (shirtDataUrl && shortDataUrl ? gap : 0)
    let imgX = (pageWidth - totalW) / 2

    if (shirtDataUrl) {
      safeAddImage(shirtDataUrl, imgX, yPosition, imgW, imgH)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Playera', imgX + imgW / 2, yPosition + imgH + 4, { align: 'center' })
      imgX += imgW + gap
    }
    if (shortDataUrl) {
      safeAddImage(shortDataUrl, imgX, yPosition, imgW, imgH)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Short', imgX + imgW / 2, yPosition + imgH + 4, { align: 'center' })
    }
    yPosition += imgH + 10
  }

  // Productos agrupados
  groupedProducts.forEach((product, idx) => {
    const isShirt = isShirtView(product)
    const productImg = productDataUrls[idx]

    yPosition = ensureSpace(80, yPosition)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    const genderTxt = product.gender === 1 ? 'H' : product.gender === 2 ? 'M' : ''
    const title = `${isShirt ? 'Playera' : 'Short'} — ${product.discipline || ''}${
      genderTxt ? ` (${genderTxt})` : ''
    }`
    doc.text(title, margin, yPosition)
    yPosition += 5

    const imgW = 32
    const imgH = 40
    const specsX = margin + imgW + 6
    const specsStartY = yPosition

    safeAddImage(productImg, margin, yPosition, imgW, imgH)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const specs: Array<[string, string]> = []
    if (isShirt) {
      specs.push(['Tela Frente', getMaterialName(product.clothFrontShirtId)])
      specs.push(['Tela Espalda', getMaterialName(product.clothBackShirtId)])
      specs.push(['Tela Manga', getMaterialName(product.clothSleeveId)])
      specs.push(['Tela Cuello', getMaterialName(product.clothNecklineId)])
      specs.push(['Tela Puño', getMaterialName(product.clothCuffId)])
      specs.push(['Cuello', `${product.neckline || '-'} / ${product.typeNeckline || '-'}`])
      specs.push(['Manga', `${product.sleeveType || '-'} / ${product.sleeveShape || '-'}`])
      specs.push(['Puños', `${product.cuff || '-'} / ${product.typeCuff || '-'}`])
    } else {
      specs.push(['Tela Short', getMaterialName(product.clothShortId)])
      specs.push(['Vista Short', product.viewShort || '-'])
      specs.push(['Sección Short', product.shortSection || '-'])
    }

    let specY = specsStartY + 4
    const specLabelW = 28
    specs.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold')
      doc.text(`${label}:`, specsX, specY)
      doc.setFont('helvetica', 'normal')
      const wrapped = doc.splitTextToSize(String(value || '-'), pageWidth - specsX - specLabelW - margin)
      doc.text(wrapped, specsX + specLabelW, specY)
      specY += 4.5 * Math.max(1, Array.isArray(wrapped) ? wrapped.length : 1)
    })

    yPosition = Math.max(specsStartY + imgH, specY) + 4

    const tableRows = product.originals.map((o) => [
      o.size || '-',
      String(o.quantity ?? '-'),
      genderMap[Number(o.gender)] || '-',
      o.observation || ''
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['Talla', 'Cantidad', 'Género', 'Observación']],
      body: tableRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [66, 66, 66], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 25, halign: 'center' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 'auto' as any }
      }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 8
    doc.setDrawColor(200)
    doc.line(margin, yPosition - 4, pageWidth - margin, yPosition - 4)
  })

  // Footer
  const footerEstimatedHeight = 25
  if (yPosition + footerEstimatedHeight > pageHeight - margin) {
    doc.addPage()
    yPosition = margin
  } else {
    yPosition = pageHeight - margin - footerEstimatedHeight
  }

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('1 Y 2 Hidalgo, Zona Centro Cd. Victoria, Tamaulipas', pageWidth - margin, yPosition, { align: 'right' })
  yPosition += 5
  doc.text('Tel: (834)-312-16-58   Whatsapp: 8341330078', pageWidth - margin, yPosition, { align: 'right' })
  yPosition += 7
  doc.setFontSize(8)
  const contactText =
    'Si usted tiene alguna pregunta sobre esta orden de corte, por favor, póngase en contacto con nosotros ' +
    'INK SUBLIMACIÓN, al 31 2 16 58 o a nuestro E-mail inkcomprasvic@gmail.com'
  const wrapped = doc.splitTextToSize(contactText, pageWidth - margin * 2)
  doc.text(wrapped, pageWidth - margin, yPosition, { align: 'right' })

  doc.save(`orden_corte_${order.id}.pdf`)
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
