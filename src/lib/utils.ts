
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Client, Truck } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate Brazilian fake data
export function generateFakeClients(count: number = 10): Client[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `client-${i + 1}`,
    name: `Transportadora ${['Brasil', 'São Paulo', 'Rio', 'Nacional', 'Express', 'Rápida'][i % 6]} ${i + 1}`,
    cnpj: generateCNPJ(),
    address: `Av. ${['Paulista', 'Brasil', 'Atlântica', 'das Nações', 'Central'][i % 5]}, ${100 + i}, ${['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'][i % 5]}`,
    phone: `(${10 + (i % 89)}) 9${8000 + i}-${1000 + i}`,
    email: `contato@transportadora${i + 1}.com.br`,
    contactPerson: `${['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Carla'][i % 6]} ${['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira'][i % 5]}`,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

export function generateFakeTrucks(clients: Client[], count: number = 30): Truck[] {
  const truckModels = ['Volvo FH', 'Scania R450', 'Mercedes-Benz Actros', 'DAF XF', 'Iveco Stralis', 'MAN TGX', 'Volkswagen Constellation', 'Ford Cargo']
  const colors = ['Branco', 'Prata', 'Azul', 'Vermelho', 'Preto', 'Verde']
  const statuses: ('active' | 'maintenance' | 'inactive')[] = ['active', 'maintenance', 'inactive']
  
  return Array.from({ length: count }).map((_, i) => {
    const clientIndex = i % clients.length
    const client = clients[clientIndex]
    const status = statuses[Math.floor(Math.random() * 3)]
    const lastMaintenance = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
    
    return {
      id: `truck-${i + 1}`,
      clientId: client.id,
      licensePlate: generateLicensePlate(),
      renavam: generateRenavam(),
      chassisNumber: generateChassisNumber(),
      modelYear: `${2018 + (i % 6)}`,
      color: colors[i % colors.length],
      model: truckModels[i % truckModels.length],
      status,
      lastMaintenanceDate: lastMaintenance.toISOString(),
      nextMaintenanceDate: status !== 'inactive' 
        ? new Date(lastMaintenance.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString() 
        : undefined,
      createdAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    }
  })
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
}

function generateCNPJ(): string {
  const n1 = Math.floor(Math.random() * 10)
  const n2 = Math.floor(Math.random() * 10)
  const n3 = Math.floor(Math.random() * 10)
  const n4 = Math.floor(Math.random() * 10)
  const n5 = Math.floor(Math.random() * 10)
  const n6 = Math.floor(Math.random() * 10)
  const n7 = Math.floor(Math.random() * 10)
  const n8 = Math.floor(Math.random() * 10)
  const n9 = 0
  const n10 = 0
  const n11 = 0
  const n12 = 1
  
  let d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5
  d1 = 11 - (d1 % 11)
  if (d1 >= 10) d1 = 0
  
  let d2 = d1 * 2 + n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2 + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6
  d2 = 11 - (d2 % 11)
  if (d2 >= 10) d2 = 0
  
  return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${n10}${n11}${n12}${d1}${d2}`
}

function generateLicensePlate(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetter = () => letters[Math.floor(Math.random() * letters.length)]
  
  const letter1 = randomLetter()
  const letter2 = randomLetter()
  const letter3 = randomLetter()
  
  const num1 = Math.floor(Math.random() * 10)
  const num2 = Math.floor(Math.random() * 10)
  const num3 = Math.floor(Math.random() * 10)
  const num4 = Math.floor(Math.random() * 10)
  
  // Mercosul plate format: AAA0A00
  return `${letter1}${letter2}${letter3}${num1}${randomLetter()}${num2}${num3}`
}

function generateRenavam(): string {
  let renavam = ''
  for (let i = 0; i < 11; i++) {
    renavam += Math.floor(Math.random() * 10)
  }
  return renavam
}

function generateChassisNumber(): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ'
  const digits = '0123456789'
  
  let chassisNumber = ''
  
  // First 3 characters are letters (World Manufacturer Identifier)
  for (let i = 0; i < 3; i++) {
    chassisNumber += letters[Math.floor(Math.random() * letters.length)]
  }
  
  // Next 5 characters can be alphanumeric (Vehicle Descriptor Section)
  for (let i = 0; i < 5; i++) {
    const useDigit = Math.random() > 0.5
    chassisNumber += useDigit ? 
      digits[Math.floor(Math.random() * digits.length)] : 
      letters[Math.floor(Math.random() * letters.length)]
  }
  
  // Last 9 characters, with the last 8 typically being digits (Vehicle Identifier Section)
  chassisNumber += letters[Math.floor(Math.random() * letters.length)]
  
  for (let i = 0; i < 8; i++) {
    chassisNumber += digits[Math.floor(Math.random() * digits.length)]
  }
  
  return chassisNumber
}

// Function to calculate statistics
export function calculateDashboardStats(clients: Client[], trucks: Truck[]): DashboardStats {
  const activeTrucks = trucks.filter(truck => truck.status === 'active').length
  const maintenanceTrucks = trucks.filter(truck => truck.status === 'maintenance').length
  const inactiveTrucks = trucks.filter(truck => truck.status === 'inactive').length
  
  return {
    totalClients: clients.length,
    totalTrucks: trucks.length,
    activeTrucks,
    maintenanceTrucks,
    inactiveTrucks
  }
}
