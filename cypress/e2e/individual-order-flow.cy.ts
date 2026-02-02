describe("Individual Order Flow", () => {
  before(() => {
    cy.visit(Cypress.env("BASE_URL") || "https://9d86-23-27-185-189.ngrok-free.app")

    // Handle ngrok security page
    cy.get("body").then(($body) => {
      if (
        $body.find(
          'button.bg-blue-600.text-white:contains("Visit Site")'
        ).length > 0
      ) {
        cy.get("button.bg-blue-600.text-white")
          .contains("Visit Site")
          .click()
        cy.wait(2000)
      }
    })
  })

  Cypress.on("uncaught:exception", (err) => {
    if (
      err.message.includes("postMessage") ||
      err.message.includes("null")
    ) {
      return false
    }
    return true
  })

  it("should complete the individual order flow successfully", () => {
    // Step 1: Select Individual Order
    cy.contains("Individual Order").should("be.visible")
    cy.contains("button", "Select Individual").click()

    // Step 2: Add parcel (WEIGHT ONLY)
    const weight = 3 // T1 by weight

    cy.get('input[id="weight"]').clear().type(weight.toString())
    cy.contains("button", "Add Parcel").click()

    // Verify parcel added
    cy.contains(`${weight.toFixed(1)} kg`).should("be.visible")

    // Continue
    cy.contains("button", "Continue to Delivery Method").click()

    // Step 3: Choose ATL
    cy.contains("Authorized to Leave (ATL)")
      .closest("label")
      .click()

    // Show pricing details
    cy.contains("Show Details").click()

    // Verify pricing tier (WEIGHT ONLY)
    cy.contains("Pricing Tier:")
      .parent()
      .should("contain", "T1")

    cy.contains("Base Price:")
      .parent()
      .should("contain", "$4.50")

    cy.contains("button", "Next").click()

    // Step 4: Sender info
    const senderInfo = {
      name: "John Sender",
      contactNumber: "91234567",
      email: "john.sender@example.com",
      street: "123 Orchard Road",
      unitNo: "#05-01",
      postalCode: "238861",
    }

    cy.get('input[id="name"]').clear().type(senderInfo.name)
    cy.get('input[id="contactNumber"]')
      .clear()
      .type(senderInfo.contactNumber)
    cy.get('input[id="email"]').clear().type(senderInfo.email)
    cy.get('input[id="street"]').clear().type(senderInfo.street)
    cy.get('input[id="unitNo"]').clear().type(senderInfo.unitNo)
    cy.get('input[id="postalCode"]').clear().type(senderInfo.postalCode)

    cy.contains("button", "Next").click()

    // Step 5: Recipient info
    cy.wait(500)
    cy.fillAddressForm({
      name: "Jane Recipient",
      contactNumber: "98765432",
      email: "jane.recipient@example.com",
      street: "456 Jurong West Street 41",
      unitNo: "#10-12",
      postalCode: "649413",
    })

    cy.contains("button", "Next").click()

    // Step 6: Payment page verification
    cy.contains("Payment").should("be.visible")
    cy.contains("Order Summary").should("be.visible")
    cy.contains("Sender:").next().should("contain", senderInfo.name)
    cy.contains("Recipient:").next().should("contain", "Jane Recipient")
    cy.contains("Delivery Method:").next().should("contain", "atl")

    // Total price (T1 only)
    cy.contains("Total Price:")
      .next()
      .should("contain", "$4.50")

    cy.get('input[id="terms-checkbox"]').check()

    cy.log("**Proceeding to HitPay payment**")
    cy.contains("button", "Proceed to Payment").click()

    cy.pause()
  })
})
