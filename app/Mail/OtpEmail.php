<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $memberName;
    public $orderId;
    public $date;
    public $memberEmail;

    /**
     * Create a new message instance.
     */
    public function __construct($otp, $memberName, $orderId, $date, $memberEmail)
    {
        $this->otp = $otp;
        $this->memberName = $memberName;
        $this->orderId = $orderId;
        $this->date = $date;
        $this->memberEmail = $memberEmail;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Transaction OTP - Serve Cafe',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.otp',
            with: [
                'otp' => $this->otp,
                'member_name' => $this->memberName,
                'order_id' => $this->orderId,
                'date' => $this->date,
                'member_email' => $this->memberEmail,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
