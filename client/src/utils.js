const guest_numbers = {
  "1": "1", "2": "2", "3": "3", "4": "4"
}

const number_names = {
  "1": "One", "2": "Two", "3": "Three", "4": "Four"
}

export const number_of_guests = () => {
  const guest_keys = Object.keys(guest_numbers).sort()
  return guest_keys.map((key) => {
      return {
          key: key.toLowerCase(),
          value: guest_numbers[key],
          flag: key.toLowerCase(),
          text: `${number_names[key]}`
      }
  })
}