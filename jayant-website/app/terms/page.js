import TermsData from '@/Component/TermsData.json'

const Terms = () => {
    return (
        <>
            <div className='container mx-auto py-10 px-4'>
                <div className="rounded-xl border text-card-foreground shadow-md bg-card">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="tracking-tight text-2xl font-bold text-foreground">Terms and Conditions</div>
                        <p className="text-sm text-muted-foreground">Last Updated: April 1, 2025</p>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
                            <p className="text-card-foreground">By accessing or using our website, playing games, or accessing free web apps, you agree to these Terms and Conditions. If you do not agree, please do not use our services.</p>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">2. Services Provided</h2>
                            <p className="text-card-foreground">We offer wide range of web apps on various topics. In addition, we provide AD less content so that you would not be disturb you when you are busy.</p>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">3. Disclaimer</h2>
                            <p className="text-card-foreground">Free Web Apps are provided for entertainment purposes. While we strive to ensure accuracy, we make no guarantees about outcomes or results of applying the information.</p>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">4. User Conduct</h2>
                            <p className="text-card-foreground">You agree not to misuse the website or its content, including:</p>
                            <ul className="list-disc pl-6 space-y-1 text-card-foreground">
                                <li>Attempting to hack or disrupt our services.</li>
                                <li>Uploading or sharing inappropriate content on our platform.</li>
                                <li>Recording or capturing any course content in any form.</li>
                            </ul>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">5. Modifications to Terms</h2>
                            <p className="text-card-foreground">Jayant - Website reserves the right to update or modify these Terms and Conditions at any time without prior notice.</p>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">6. Contact Us</h2>
                            <p className="text-card-foreground">If you have any questions or concerns about this Privacy Policy, feel free to
                                contact us:</p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Terms;