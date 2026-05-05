import { ContactService } from './contact.service';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submit(body: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<{
        message: string;
    }>;
}
