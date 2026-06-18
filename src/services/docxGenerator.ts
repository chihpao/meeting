import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  convertInchesToTwip,
  BorderStyle,
} from 'docx';
import type { MeetingResult } from '../types';

const FONT_CONFIG = {
  name: '標楷體',
  eastAsia: '標楷體',
  ascii: 'Times New Roman',
  hAnsi: 'Times New Roman',
};

const SIZE = 28; // 14pt * 2

function text(t: string, opts?: { bold?: boolean; size?: number }) {
  return new TextRun({
    text: t,
    font: FONT_CONFIG,
    size: opts?.size ?? SIZE,
    bold: opts?.bold,
  });
}

function centeredPara(t: string, opts?: { bold?: boolean; size?: number }) {
  return new Paragraph({
    children: [text(t, opts)],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  });
}

function sectionTitle(t: string) {
  return new Paragraph({
    children: [text(t, { bold: true })],
    spacing: { before: 200, after: 100 },
  });
}

function bodyPara(t: string) {
  return new Paragraph({
    children: [text(t)],
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.3) },
  });
}

export async function downloadDocx(data: MeetingResult): Promise<void> {
  const children: (Paragraph | Table)[] = [];

  // Line 1: Project name (centered)
  children.push(centeredPara(data.project_name, { bold: true, size: 32 }));

  // Line 2: Meeting type + 會議紀錄 (centered)
  children.push(centeredPara(`${data.meeting_type} 會議紀錄`, { bold: true, size: 32 }));

  // Empty line
  children.push(new Paragraph({ spacing: { after: 200 } }));

  // 壹、開會時間
  children.push(sectionTitle('壹、開會時間：'));
  children.push(bodyPara(data.date));

  // 貳、開會地點
  children.push(sectionTitle('貳、開會地點：'));
  children.push(bodyPara(data.location));

  // 參、主持人
  children.push(sectionTitle('參、主持人：'));
  children.push(bodyPara(data.host));

  // 肆、出席單位及人員
  children.push(sectionTitle('肆、出席單位及人員：'));
  data.attendees.forEach((a) => {
    children.push(bodyPara(a));
  });

  // 伍、討論事項
  children.push(sectionTitle('伍、討論事項：'));
  data.discussion.forEach((d, i) => {
    children.push(bodyPara(`${i + 1}. ${d.topic}`));
    children.push(new Paragraph({
      children: [text(`內容：${d.content}`)],
      spacing: { after: 60 },
      indent: { left: convertInchesToTwip(0.5) },
    }));
    children.push(new Paragraph({
      children: [text(`決議：${d.resolution}`)],
      spacing: { after: 120 },
      indent: { left: convertInchesToTwip(0.5) },
    }));
  });

  // 陸、待辦事項與待提供文件
  children.push(sectionTitle('陸、待辦事項與待提供文件：'));
  if (data.action_items.length > 0) {
    const borderStyle = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: '000000',
    };
    const borders = {
      top: borderStyle,
      bottom: borderStyle,
      left: borderStyle,
      right: borderStyle,
    };

    const headerRow = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [text('負責單位', { bold: true })], alignment: AlignmentType.CENTER })],
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders,
        }),
        new TableCell({
          children: [new Paragraph({ children: [text('待辦事項', { bold: true })], alignment: AlignmentType.CENTER })],
          width: { size: 60, type: WidthType.PERCENTAGE },
          borders,
        }),
        new TableCell({
          children: [new Paragraph({ children: [text('期限', { bold: true })], alignment: AlignmentType.CENTER })],
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders,
        }),
      ],
    });

    const dataRows = data.action_items.map((ai) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [text(ai.unit)] })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders,
          }),
          new TableCell({
            children: [new Paragraph({ children: [text(ai.task)] })],
            width: { size: 60, type: WidthType.PERCENTAGE },
            borders,
          }),
          new TableCell({
            children: [new Paragraph({ children: [text(ai.deadline)] })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders,
          }),
        ],
      })
    );

    children.push(
      new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
  }

  // 柒、後續安排
  children.push(sectionTitle('柒、後續安排：'));
  children.push(bodyPara(data.follow_up));

  // Build document
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_CONFIG,
            size: SIZE,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertInchesToTwip(8.27),
              height: convertInchesToTwip(11.69),
            },
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.project_name}_${data.meeting_type}_會議紀錄.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
