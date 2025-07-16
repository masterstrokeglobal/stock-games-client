"use client"
import { useGetMyCompany } from '@/react-query/company-queries';
function TermsAndConditions() {
    const { data } = useGetMyCompany();

    const name = data?.name;

    return (
        <div className="max-w-4xl mx-auto p-6 ">
            <div className="prose !text-platform-text max-w-none">
                <h1 className="text-3xl font-bold text-center font-bold mb-8">INTRODUCTION - WHO WE ARE AND WHAT WE DO?</h1>
                <p className="mb-4">We are the flagship brand of {name}, offering Our Platform to You and an opportunity for You to participate in Contests spanning across a broad range of market events (&quot;Services&quot;). An illustrative list of such market events is mentioned below as maybe modified from time to time (&quot;Markets&quot;):</p>

                <ul className="list-disc pl-6 mb-6">
                    <li>US Stocks</li>
                    <li>Indian Stocks</li>
                    <li>Cryptocurrencies</li>
                </ul>

                <p className="mb-6">Any person using, accessing and/or participating in any stock-related free-to-play online contests (&quot;Practice Contest&quot;) and/or pay-to-play online contests (&quot;Paid Contest&quot;) on Our Platform is a user (&quot;User&quot;). All references to &quot;You/Your&quot; relate to the User. All references to &quot;We/Us/Our&quot; relate to &quot;{ name}&quot; which denotes a collective reference to the { name} mobile application and the { name} website (hereinafter collectively referred to as &quot;Platform&quot;). Practice Contest and Paid Contest are hereinafter collectively referred to as &quot;Contests&quot;.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">ACCEPTANCE OF OUR TERMS AND CONDITIONS</h2>

                <p className="mb-4">Your continued usage of Our Platform constitutes Your acceptance of the terms and conditions, including any additional terms that We may make available to You (&quot;Terms&quot;) and are contractually binding on You.</p>

                <p className="mb-6">You accept that in the event of any variance between these Terms and any additional terms relating to the usage of Our Platform or any Contest, the additional terms will prevail.</p>

                <p className="mb-4">By accepting these Terms, You agree and consent to receive communications from Us and/or Our partners, licensors or associates for any purpose through the following modes:</p>

                <ul className="list-disc pl-6 mb-6">
                    <li>Announcements;</li>
                    <li>Administrative messages/direct messages;</li>
                    <li>Advertisements;</li>
                    <li>direct notification to your account; and</li>
                    <li>by any other means that We may consider fit for this purpose.</li>
                </ul>

                <p className="mb-6">You agree that You shall mark Us as a safe sender on all Your platforms where You receive any such communications from Us (including via email and SMS) to ensure such communications are not transferred to the spam/junk folder.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">USER ACCOUNT</h2>

                <p className="mb-4">You are required to register on Our Platform to create an account to access Our Services (&quot;Account&quot;). At the time of creating Your Account and/or at any time during the utilisation of Our Services, You will be required to provide any and/or all of the following information and/or documents:</p>

                <ul className="list-disc pl-6 mb-6">
                    <li>Your full name;</li>
                    <li>Your team name;</li>
                    <li>Your mobile number;</li>
                    <li>Your gender; and</li>
                    <li>Your date of birth.</li>
                    <li>Bank Account information</li>
                    <li>UPI ID</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">ELIGIBILITY</h2>

                <p className="mb-4">To participate in any Paid Contest, you must meet the following eligibility criteria:</p>

                <ul className="list-disc pl-6 mb-6">
                    <li>You must be above the age of 18 years.</li>
                    <li>You must have a valid mobile number or Email to create an Account.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">CONTEST RULES AND FORMAT</h2>

                <h3 className="text-xl font-bold mt-6 mb-3">CONTEST RULES</h3>

                <p className="mb-4">You agree and acknowledge that:</p>


                <p className="mb-4">Flexible and Non-Flexible Contest</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>A Contest will be operational even if a minimum of (2) two Users join such a Contest (&quot;Flexible Contest&quot;)</li>
                    <li>A Contest will be operational only if the number of Users participating in such Contest is equal to the limit set by us in case of a Public Contest and by You in case of a Private Contest (&quot;Non-Flexible Contest&quot;)</li>
                    <li>The Prize Money Pool shall be directly proportional to the number of Users participating in a Flexible Contest. For clarity, the Prize Money Pool specified on the Contest page will decrease if the number of Users joining the Contest is less than the limit set by You for a Private Contest and by Us for a Public Contest.</li>
                </ul>

                <p className="mb-4">In participating in Contests, You agree to strictly comply with the Terms, including additional rules published by Us, such as:</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>&quot;{ name} Rules&quot; (available on our website); and</li>
                    <li>any other rules and regulations (including without limitation in relation to payments made to participate in any Contest)</li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-3">CONTEST FORMATS</h3>

                <p className="mb-4">Public Contest</p>
                <p className="mb-4">A Public Contest is a Contest where You can participate with other Users without any restrictions.</p>
                <p className="mb-4">Features of Public Contests:</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>Public Contest can either be a Flexible Contest or a Non-Flexible Contest.</li>
                    <li>We reserve the right to cancel the Public Contest if the number of participating Users is less than the Pre Specified Number of Users. If cancelled We will return Your Pre Designated Amount without any deduction.</li>
                    <li>If a Contest is labelled as a &quot;Guaranteed Contest&quot; it will become operational when the Pre-Specified Number of Users join the Contest. The Prize Money Pool for each Guaranteed Contest is predetermined. We will cover the shortfall if there are not enough Users in a Guaranteed Contest to meet the guaranteed Prize Money Pool.</li>
                    <li>We will declare the winners as per the Contest page, regardless of the number of Users joining the Contest</li>
                </ul>

                <p className="mb-4">Private Contest</p>
                <p className="mb-4">A Private Contest is where You can create a Contest and invite other Users (&quot;Invited Users&quot;) to join your Contest.</p>
                <p className="mb-4">Features of Private Contest: To create a Private Contest, You need to ensure</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>You provide a name to the Private Contest;</li>
                    <li>You set a limit on the number of Users joining the Private Contest, which can range from 2-20,000 users;</li>
                    <li>You will have the right to select whether Your Contest will be a Flexible Contest or a Non-Flexible Contest.</li>
                    <li>Pay the Pre-Designated Amount to join the Private Contest.</li>
                    <li> The Tier Update will happen every 2 hours a day</li>
                    <li> The Login Points and First Game Played Points will be given based on the tier according to the UTC time every day</li>
                    <li> The Shuffle of market items will happen randomly every 2 minutes</li>
                    <li> In case the round is abandoned or cancelled, the  Points will be refunded</li>
                </ul>

                <p className="mb-6">After You create a Private Contest, We will provide a unique identification code for the Private Contest that You can share with other Users for participating in the Private Contest (&quot;Contest Code&quot;).</p>
                <p className="mb-6">Invited User(s) must enter the Contest Code and pay the Pre-Designated Amount to join the Private Contest.</p>
                <p className="mb-6">We will refund the Pre-Designated Amount if one hour before the Contest Deadline, the users participating in the Private Contest are less than</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>either the Pre-Specified Number of Users as applicable for a Flexible Contest;</li>
                    <li>the limit set by You for a Non-Flexible Contest.</li>
                </ul>

                <p className="mb-6">We will process the refund after the expiry of the Contest Deadline.</p>
                <p className="mb-6">We will not be liable to the Invited User(s) for their inability to join the Private Contest for any reason not attributable to Us</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">WINNING</h2>

                <h3 className="text-xl font-bold mt-6 mb-3">TABULATION AND SCORING</h3>

                <ul className="list-disc pl-6 mb-6">
                    <li>We use Data Feed Providers and/or the official website of the Markets organiser to obtain scores and relevant information required for calculating the points.</li>
                    <li>If there is an error in calculating the points that are brought to Our attention due to inaccuracies or incompleteness of the information provided by the Data Feed Provider, We shall do Our best to rectify said errors before distributing the prizes.</li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-3">VERIFICATION OF WINNERS</h3>

                <ul className="list-disc pl-6 mb-6">
                    <li>We or our third-party service providers working on behalf of us may contact the Winners on the email address or mobile number provided at the time of Account creation. At this stage, Winner will be explained the details of the verification process and the documents required for collecting the prize.</li>
                    <li>If You have been declared as a Winner on Our Platform but have not received Your Winnings, You may contact Our Help and Support within forty-eight (48) hours of the Winner declaration to help us resolve your concern at the earliest.</li>
                    <li>You agree and acknowledge that Our decision with respect to awarding the Winnings as per the Terms will be final and binding on You.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">PAYMENT TERMS</h2>

                <p className="mb-6">The below terms govern all payment-related transactions made by You, and You agree to abide by them.</p>

                <h3 className="text-xl font-bold mt-6 mb-3">PAYMENT ACCOUNTS</h3>

                <p className="mb-6">By accessing and using Our Platform, You are provided with the following categories of accounts for processing and reconciling Your payments:</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>Unutilized Account - This account holds any amount remitted by You through a designated payment gateway for availing Our Services; and</li>
                    <li>Winning Account - This account holds your winnings in any Paid Contests.</li>
                    <li>Play Winning Account - This is a sub-set of Your winnings account only and holds winning amount that You have selected to keep as Play Winnings. Play winnings are non-withdrawable, can be used to join Contests and do not expire.</li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-3">DISCOUNT OFFERED</h3>

                <p className="mb-6">In order to conduct promotional activities and provide incentives, We may issue discounts to You which may be utilised for joining any paid Public Contest(s) (&quot;Discount(s)&quot;). You agree to the following</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>You shall not be permitted to transfer or withdraw any amount of Discounts offered to any other account including Your bank account.</li>
                    <li>The utilization of any Discount shall be subject to certain terms which will be notified to You at the time of issuance of any Discount.</li>
                    <li>Discount shall be issued at our sole discretion and will not be demanded as a matter of right.</li>
                    <li>Discount will be applied towards the Pre-designated Amount for joining any Contest.</li>
                    <li>Upon termination of Your Account, all Discounts shall be forfeited and You shall not have any right or interest on such Discount.</li>
                    <li>Any Discount issued to you may take up to 24 hours to reflect in their respective Discount account as defined below. You agree not to hold Us responsible or liable for any delay, including any loss of opportunity to join any Contest(s) due to delay in crediting the Discount.</li>
                    <li>In the event of any conflict between these Terms and the terms specific to the Discount, if any, the Discount terms shall prevail.</li>
                </ul>

                <p className="mb-6">We offer the following Discounts</p>
                <p className="mb-6">Discount Point</p>
                <p className="mb-6">We may award discount points at the time of a successful deposit in your Unutilized Account (&quot;Discount Point&quot;). Your utilization of the Discount Points shall be subject to the following terms and conditions:</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>Discount Points shall be valid for a period of ninety (90) days from the date of issuance</li>
                    <li>Discount Points shall be credited to your Discount Point account (&quot;Discount Point Account&quot;).</li>
                    <li>While participating in any Paid Contest, a certain percentage of available Discount Points in Your Discount Point Account shall be applied to the Pre Designated Amount.</li>
                    <li>Deduction of Discount Points from the Pre-Designated Amount is in addition to any other Discounts available to You.</li>
                    <li>You agree that in the event of any request for refund of the amount deposited in the Unutilized Account, any Discount Points awarded to you in connection with such amount deposited shall stand forfeited and you will not be able to utilize such Discount Points.</li>
                    <li>If a market session is abandoned or cancelled, the applicable Discount Points deducted from the Pre Designated Amount shall be returned to Your Discount Point Account.</li>
                </ul>

                <p className="mb-6">Discount Bonus</p>
                <p className="mb-6">We may at our discretion as part of our Promotion issue a Discount bonus to You in accordance with the terms and conditions applicable to such Promotions. (&quot;Discount Bonus&quot;). In addition to the terms relating to the Promotion, You agree to the following:</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>Discount Bonus shall be credited to your Discount Bonus account upon fulfilling the applicable conditions under the respective Promotions (&quot;Discount Bonus Account&quot;).</li>
                    <li>Discount Bonus will be automatically deducted from the Pre-Designated Amount payable by You.</li>
                    <li>Discount Bonuses shall be valid for a period of 14 days from the date of the credit</li>
                    <li>Discount Bonus worth maximum Rs. 15000 can be utilized in a single market session.</li>
                </ul>

                <p className="mb-6">Discount Coupons.</p>
                <p className="mb-6">We may grant Discount coupons at Our sole discretion and each Discount coupon shall be governed by the specific terms and conditions as notified by Us at the time of grant of such Discount coupons. You acknowledge that Discount coupons shall have their own validity and specific terms and conditions available on the Platform. In case of any conflict between these Terms and the terms specific to the Discount coupon, the terms specific to the Discount coupon shall prevail.</p>

                <h3 className="text-xl font-bold mt-6 mb-3">PRE-DESIGNATED AMOUNT PAYMENT</h3>

                <p className="mb-6">When You join any Contest, subject to the deduction of Discount Bonus, Discount Coupons and Discount Points (if any), the Pre-Designated Amount gets debited first from the Unutilized Account, Play Winnings and then from Your Winnings Account. For the Unutilized Account, debits will be made in order of the date when the funds were first credited.</p>

                <p className="mb-6">If You do not have enough balance in either of your Accounts to participate in any Paid Contest, You will need to remit the Pre-Designated Amount required to join the Contest(s). You agree that any amount deposited shall be subject to applicable fees in accordance with these Terms.</p>

                <h3 className="text-xl font-bold mt-6 mb-3">WITHDRAWALS PROCESSING</h3>

                <ul className="list-disc pl-6 mb-6">
                    <li>You will be prompted to provide certain documents for processing your payments and verification purposes at the time of your first withdrawal.</li>
                    <li>The name mentioned on the identification document as provided by You in the app should correspond with the name of the Bank Account holder of the Bank or linked to the UPI ID provided by You at the time of bank account or UPI verification at the time of withdrawal or bank account change request.</li>
                    <li>We will process your withdrawal after verifying your bank account details and/or UPI ID (as applicable). Upon verification, we will debit the amount from your Winning Account and transfer it online to your bank account at the earliest.</li>
                    <li>{`The minimum amount that can be withdrawn via single transaction shall be communicated on the { name} app's withdrawal page.`}</li>
                    <li>We may charge any processing fee for the online transfer of funds from your Winning Account to Your bank account</li>
                    <li>We depend on banks and third parties to process transactions on Our Platform. Thus, we may take up to 24 hours to process any payments to Your bank account. You agree not to hold Us responsible or liable for any delay in processing any payments.</li>
                    <li>A transaction, once confirmed, is final, and no cancellation is permissible.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">REFUNDS</h2>

                <ul className="list-disc pl-6 mb-6">
                    <li>We will refund any amount left in your Unutilised Account if your Account gets suspended or removed
                        <ul className="list-disc pl-6 mb-4">
                            <li>due to Our failure to provide Services,</li>
                            <li>any instruction received from any regulatory authority</li>
                        </ul>
                    </li>
                    <li>We will refund the Pre-Designated Amount paid by You in case any Contest is abandoned in accordance with these Terms.</li>
                    <li>We shall deactivate Your Account pursuant to any direction issued by an appropriate regulatory authority. If We receive requisite instructions from such authority, We shall refund the deposited amount from Your Unutilised Account to the source account, subject to applicable processing fees.</li>
                    <li>In the event Our Services are not available due to reasons outside Our control, including but not limited to any failure to perform due to unforeseen circumstances or cause beyond Our control, such as acts of god, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemic, epidemic, network infrastructure failures, strikes, or shortages of transportation facilities, fuel, energy, labor or materials or any cancellation of services available on Our Platform (each a &quot;Force Majeure Event&quot;), then We reserve the right to cancel any Contest and process refund of the Pre-Designated Amount.</li>
                    <li>In the event of a Paid Contest involving up to 4 Users, where all the Users have entered the same portfolios (including the same stocks and weightages), the Pre-Designated Amount shall be refunded to all the users after the market opens. The refund shall be credited to the account from which the Pre-designated Amount was utilized. For a Paid Contest involving 5 or more Users, where all the Users have entered the same portfolios (including the same stocks and weightages), the Prize Money Pool shall be equally divided between the Users.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">USER FUNDS</h2>

                <ul className="list-disc pl-6 mb-6">
                    <li>You hereby authorise Us to appoint an independent third-party/trustee/escrow agent to act on your behalf in a fiduciary capacity (&quot;Third Party&quot;) with respect to holding any amount belonging to You and undertaking actions, consents, approvals and any other requisite instructions necessary for such amount.</li>
                    <li>You acknowledge that
                        <ul className="list-disc pl-6 mb-4">
                            <li>We do not hold any right, title and/or interest in the Prize Money Pool.</li>
                            <li>the amount deposited by You will be used only for participation in the Paid Contest and/or any other value-added services availed.</li>
                            <li>any amount deposited by You, shall not be forfeited by Us except in case where We receive an instruction from any regulatory authority.</li>
                        </ul>
                    </li>
                    <li>You further authorize Us to instruct the Third Party to open a bank account(s) which will be used for including but not limited to the following payouts:
                        <ul className="list-disc pl-6 mb-4">
                            <li>withdrawal of Your winnings;</li>
                            <li>payment of Platform Fee;</li>
                            <li>payments towards any other value added services offered by Us.</li>
                        </ul>
                    </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">YOUR CONDUCT</h2>

                <p className="mb-6">In using and accessing Our Platform, You agree to observe the following code of conduct:</p>

                <h3 className="text-xl font-bold mt-6 mb-3">ACCOUNT INFORMATION</h3>

                <ul className="list-disc pl-6 mb-6">
                    <li>You are permitted to create only one Account on Our Platform. When creating Your Account with Us (or updating Your Account information), You agree that You will provide true, accurate and updated information and documentation. You will not provide any false and/or incorrect information and documentation nor impersonate or attempt to impersonate and/or otherwise assume the identity of another person without due authority. You will not commit any such fraudulent act which amounts to forgery and/or involves the fabrication of documentation.</li>
                    <li>You agree that You shall promptly update your Account related details on Our Platform in the event of any change in such details and/or write to Our Help and Support in the event of any; a) change in Your Account related details and/or; b) any unauthorised use of Your Account to enable us to take remedial action.</li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-3">MAINTAIN CONFIDENTIALITY</h3>

                <ul className="list-disc pl-6 mb-6">
                    <li>You will maintain the confidentiality of all information relating to Your Account, and You will not share Your One Time Password (&quot;OTP&quot;) with any other person;</li>
                    <li>You will not engage in any fraudulent conduct in logging into another user&apos;s account by asking for their account-related information or taking their OTP.</li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-3">COMPLIANCE WITH APPLICABLE LAW</h3>

                <ul className="list-disc pl-6 mb-6">
                    <li>You agree to comply with Applicable Laws.</li>
                    <li>You agree that You shall not commit any illegal act that disrupts Our systems.</li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-3">VIOLATION OF PLATFORM TERMS</h3>

                <ul className="list-disc pl-6 mb-6">
                    <li>You shall not engage in any Fair Play Violation.</li>
                    <li>You shall not violate any of the Terms in using and accessing Our Platform and Services;</li>
                    <li>You shall not misuse any Discount and/or any other offers or promotions given by Us.</li>
                    <li>You agree that you shall use the Platform and Our Services solely in Your personal capacity, and You will not engage in malpractices or collude with other Users in deriving any benefit and/or running any business in connection with the use of Our Platform and/or Services.</li>
                    <li>You shall not be engaged in any form of insider trading, i.e. illegally sharing and seeking non-public information, knowledge of participating markets in any given contests, strategies, organizing boards, leagues etc. which may give You an unfair competitive advantage. (&quot;Insider Trading&quot;)</li>
                    <li>You shall not tamper, modify, or otherwise deal with our data, content, software, technology and/or Intellectual Property by any means.</li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-3">RESPONSIBLE PLAY</h3>

                <p className="mb-6">We&apos;re committed to fostering responsible participation for all our users. You agree to participate in the Contests responsibly by making informed decisions and playing within Your means. You are encouraged to seek help if needed.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">ADDITIONAL FEATURES</h2>

                <p className="mb-6">We offer Our Users additional features on our platform</p>

                <h3 className="text-xl font-bold mt-6 mb-3">Chat Feature</h3>

                <p className="mb-6">is a tool that allows You to communicate with each other in real-time on the Platform either in a public or private setting (&quot;Chat Feature&quot;). You agree to observe the following code of conduct:</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>You shall not engage in illegal, obscene, abusive, offensive, racially insensitive, communal, objectionable, defamatory, or otherwise inappropriate and immoral conduct</li>
                    <li>You shall not harass, bully, stalk, threaten, or otherwise violate any rights of other Users;</li>
                    <li>You shall be responsible for all content published, contributed, and made available by You on Our Platform. This includes any content You share with Us (&quot;User Content/Your Content&quot;).</li>
                    <li>Your Content shall not be immoral, profane, defamatory, or offensive;</li>
                    <li>You shall not use Our Platform for advertising, offering or selling any goods or services for commercial gain except with Our prior written consent;</li>
                    <li>You shall not restrict or inhibit any other User from using Our Platform;</li>
                    <li>You shall not publish any content on Our Platform which is patently false, with the intent to mislead or harass any person or third party, whether for financial gain or to cause any injury to any person or otherwise;</li>
                    <li>You shall not collude with any other User(s) or engage in syndicate play;</li>
                    <li>You agree that such behaviour qualifies as User misconduct.</li>
                    <li>You shall not spam other User(s) by sending any unsolicited communications;</li>
                </ul>
            </div>
        </div>
    );
}



export default TermsAndConditions;
