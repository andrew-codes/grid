import styled from "@emotion/styled"
import { FC } from "react"

const StatusContainer = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const StatusIcon = styled.span<{ status: string | null }>`
  width: 1.5rem;
  height: 1.5rem;
  display: inline-block;
  border-radius: 50%;
  margin-right: 1rem;
  background: #85ce3d;
  visibility: ${({ status }) => (status === "available" ? "visible" : "hidden")};
`

const Status: FC<{ status: string | null }> = ({ status }) => {
  if (status === null) {
    return null
  }

  const display = `${status[0].toUpperCase()}${status.slice(1)}`

  return (
    <StatusContainer>
      <StatusIcon status={status} />
      <span>{display}</span>
    </StatusContainer>
  )
}

export { Status }
