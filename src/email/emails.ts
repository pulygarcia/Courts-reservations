import { transporter } from "src/config/email";

export async function sendReservationNotification({
  name,
  courtId,
  date,
  startTime,
  endTime,
}: {
  name: string;
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
}) {

  const html = `
  <div style="font-family: Arial, sans-serif; background-color:#f9fafb; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:white; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.1); overflow:hidden;">
      
      <div style="background-color:#2563eb; padding:16px; text-align:center;">
        <h1 style="color:white; margin:0;">Nueva Reserva 📅</h1>
      </div>

      <div style="padding:24px;">
        <p style="font-size:16px; color:#111827;">
          Se ha registrado una nueva reserva en <strong>El Galpón Pádel</strong>.
        </p>

        <table style="width:100%; border-collapse:collapse; margin-top:16px;">
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb; font-weight:bold;">Cliente</td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb; font-weight:bold;">Cancha</td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${courtId}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb; font-weight:bold;">Fecha</td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${date}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb; font-weight:bold;">Hora</td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${startTime} - ${endTime}</td>
          </tr>
        </table>

        <p style="margin-top:24px; font-size:14px; color:#6b7280;">
          Este email fue generado automáticamente. No responder directamente.
        </p>
      </div>
    </div>
  </div>
  `;

  await transporter.sendMail({
    from: 'reservas-elgalpon@gmail.com',
    to: 'galponpadelclub@gmail.com',
    subject: "Nueva reserva registrada ✔",
    text: `Nueva reserva de ${name} en cancha ${courtId} el ${date} de ${startTime} a ${endTime}`,
    html,
  });
}
