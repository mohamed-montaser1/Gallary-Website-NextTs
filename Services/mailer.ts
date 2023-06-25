import useFetch from "@/hooks/useFetch";

class Mailer {
  constructor(private mail: string) {}
  async sendMail() {
    // handle sending mail to this.mail
    let data = useFetch.post(`mails/send/${this.mail}`);
    return data;
  }
  getMail() {
    return this.mail;
  }
  changeMail(newMail: string) {
    this.mail = newMail;
  }
}

export default Mailer;
